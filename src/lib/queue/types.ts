// Mirrors the planned Supabase `queue_entries` table so the UI can switch data sources without changes.
export type QueueStatus = "waiting" | "processing" | "done";

export interface QueueEntry {
  id: string;
  queue_number: number;
  customer_name: string;
  discord_username: string;
  discord_id: string;
  game: string;
  service: string;
  notes: string;
  status: QueueStatus;
  created_at: string;
  completed_at: string | null;
}

export type NewQueueEntry = Pick<
  QueueEntry,
  "customer_name" | "discord_username" | "discord_id" | "game" | "service" | "notes"
>;

export const STATUS_LABEL: Record<QueueStatus, string> = {
  waiting: "Waiting",
  processing: "Processing",
  done: "Done",
};
