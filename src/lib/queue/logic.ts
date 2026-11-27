import type { QueueEntry } from "./types";

/** Active = not done. Processing first, then by queue number. */
export function activeQueue(entries: QueueEntry[]): QueueEntry[] {
  return entries
    .filter((e) => e.status !== "done")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "processing" ? -1 : 1;
      return a.queue_number - b.queue_number;
    });
}

export function completedOrders(entries: QueueEntry[]): QueueEntry[] {
  return entries
    .filter((e) => e.status === "done")
    .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""));
}

export function nextQueueNumber(entries: QueueEntry[]): number {
  return entries.reduce((max, e) => Math.max(max, e.queue_number), 0) + 1;
}

export function isSameDay(iso: string | null, ref: Date): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}

export function queueStats(entries: QueueEntry[], now: Date = new Date()) {
  const active = entries.filter((e) => e.status !== "done");
  return {
    total: entries.length,
    active: active.length,
    processing: active.filter((e) => e.status === "processing").length,
    waiting: active.filter((e) => e.status === "waiting").length,
    completed: entries.length - active.length,
    completedToday: entries.filter((e) => e.status === "done" && isSameDay(e.completed_at, now)).length,
  };
}
