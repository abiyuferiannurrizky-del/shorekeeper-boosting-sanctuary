import { useSyncExternalStore } from "react";
import { nextQueueNumber } from "./logic";
import { SAMPLE_QUEUE } from "./sample-data";
import type { NewQueueEntry, QueueEntry, QueueStatus } from "./types";

/**
 * Phase 1 demo store: browser-local, synced across tabs (so /admin changes reach /overlay).
 * Phase 2 swaps this module's internals for Lovable Cloud reads, server-checked writes and realtime;
 * the hook and action signatures stay the same.
 */
const KEY = "bongjoki.demo-queue.v1";
type Listener = () => void;

let state: QueueEntry[] = SAMPLE_QUEUE;
let hydrated = false;
let lastUpdated: string | null = null;
const listeners = new Set<Listener>();

function emit() {
  lastUpdated = new Date().toISOString();
  listeners.forEach((l) => l());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw) as QueueEntry[];
  } catch {
    /* ignore corrupt demo data */
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY || !e.newValue) return;
    state = JSON.parse(e.newValue) as QueueEntry[];
    emit();
  });
  lastUpdated = new Date().toISOString();
}

function commit(next: QueueEntry[]) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked */
  }
  emit();
}

function subscribe(l: Listener) {
  hydrate();
  listeners.add(l);
  queueMicrotask(l);
  return () => listeners.delete(l);
}

export function useQueue(): QueueEntry[] {
  return useSyncExternalStore(subscribe, () => state, () => SAMPLE_QUEUE);
}

export function useLastUpdated(): string | null {
  return useSyncExternalStore(subscribe, () => lastUpdated, () => null);
}

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));

export const queueActions = {
  add(input: NewQueueEntry): QueueEntry {
    const entry: QueueEntry = {
      ...input,
      id: uid(),
      queue_number: nextQueueNumber(state),
      status: "waiting",
      created_at: new Date().toISOString(),
      completed_at: null,
    };
    commit([...state, entry]);
    return entry;
  },
  addMany(inputs: NewQueueEntry[]) {
    let n = nextQueueNumber(state);
    const now = new Date().toISOString();
    commit([
      ...state,
      ...inputs.map((i) => ({ ...i, id: uid(), queue_number: n++, status: "waiting" as const, created_at: now, completed_at: null })),
    ]);
  },
  update(id: string, patch: Partial<NewQueueEntry>) {
    commit(state.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  },
  setStatus(id: string, status: QueueStatus) {
    commit(
      state.map((e) =>
        e.id === id ? { ...e, status, completed_at: status === "done" ? new Date().toISOString() : null } : e,
      ),
    );
  },
  remove(id: string) {
    commit(state.filter((e) => e.id !== id));
  },
  resetDemo() {
    commit(SAMPLE_QUEUE);
  },
};
