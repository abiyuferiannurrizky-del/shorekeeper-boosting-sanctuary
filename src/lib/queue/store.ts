import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { NewQueueEntry, QueueEntry, QueueStatus } from "./types";

/**
 * Live queue data from Lovable Cloud.
 * - Public pages read `queue_public` (no Discord ID / notes).
 * - Admin reads `queue_entries`; writes are allowed by RLS only for admins.
 * - One realtime subscription (mounted in __root) refreshes every view.
 */
const EMPTY: QueueEntry[] = [];
const PUBLIC_COLS = "id,queue_number,customer_name,discord_username,game,service,status,created_at,completed_at";

async function fetchPublic(): Promise<QueueEntry[]> {
  const { data, error } = await supabase.from("queue_public").select(PUBLIC_COLS).order("queue_number");
  if (error) throw error;
  return (data ?? []).map((r) => ({ ...r, discord_id: "", notes: "", status: r.status as QueueStatus }));
}

async function fetchAdmin(): Promise<QueueEntry[]> {
  const { data, error } = await supabase.from("queue_entries").select("*").order("queue_number");
  if (error) throw error;
  return (data ?? []).map((r) => ({ ...r, status: r.status as QueueStatus }));
}

export function useQueueQuery(scope: "public" | "admin" = "public") {
  return useQuery({
    queryKey: ["queue", scope],
    queryFn: scope === "admin" ? fetchAdmin : fetchPublic,
  });
}

export function useQueue(scope: "public" | "admin" = "public"): QueueEntry[] {
  return useQueueQuery(scope).data ?? EMPTY;
}

export function useLastUpdated(): string | null {
  const { dataUpdatedAt } = useQueueQuery("public");
  return dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : null;
}

/** Mount once. Refreshes all queue queries when any order changes. */
export function useQueueRealtime() {
  const qc = useQueryClient();
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const bump = () => {
      clearTimeout(t);
      t = setTimeout(() => void qc.invalidateQueries({ queryKey: ["queue"] }), 150);
    };
    let first = true;
    const channel = supabase
      .channel(`queue-public-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "queue_public" }, bump)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          if (!first) bump();
          first = false;
        }
      });
    return () => {
      clearTimeout(t);
      void supabase.removeChannel(channel);
    };
  }, [qc]);
}

function check<T extends { error: { message: string } | null }>(res: T): T {
  if (res.error) throw new Error(res.error.message);
  return res;
}

export const queueActions = {
  async add(input: NewQueueEntry): Promise<QueueEntry> {
    const { data } = check(await supabase.from("queue_entries").insert(input).select().single());
    return { ...data!, status: data!.status as QueueStatus };
  },
  async addMany(inputs: NewQueueEntry[]) {
    check(await supabase.from("queue_entries").insert(inputs));
  },
  async update(id: string, patch: Partial<NewQueueEntry>) {
    check(await supabase.from("queue_entries").update(patch).eq("id", id));
  },
  async setStatus(id: string, status: QueueStatus) {
    check(await supabase.from("queue_entries").update({ status }).eq("id", id));
  },
  async remove(id: string) {
    check(await supabase.from("queue_entries").delete().eq("id", id));
  },
};
