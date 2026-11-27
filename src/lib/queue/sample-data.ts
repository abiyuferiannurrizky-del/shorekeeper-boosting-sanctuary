import type { QueueEntry } from "./types";

// Demo rows for the Phase 1 prototype only. Replaced by the database in Phase 2.
const row = (
  n: number,
  customer_name: string,
  discord_username: string,
  game: string,
  service: string,
  status: QueueEntry["status"],
  created_at: string,
  completed_at: string | null = null,
): QueueEntry => ({
  id: `demo-${n}`,
  queue_number: n,
  customer_name,
  discord_username,
  discord_id: String(400000000000000000 + n * 7919),
  game,
  service,
  notes: "",
  status,
  created_at,
  completed_at,
});

export const SAMPLE_QUEUE: QueueEntry[] = [
  row(1, "Rafi Pratama", "rafi.tide", "Mobile Legends", "Epic → Legend", "done", "2026-11-25T09:00:00Z", "2026-11-25T18:20:00Z"),
  row(2, "Nadia Putri", "nadiaa_", "Mobile Legends", "Mythic 5 Stars", "done", "2026-11-26T08:10:00Z", "2026-11-26T15:05:00Z"),
  row(3, "Dimas Arya", "dimz", "Wuthering Waves", "Tower of Adversity Clear", "done", "2026-11-26T10:30:00Z", "2026-11-27T05:40:00Z"),
  row(4, "Kevin Halim", "kevh", "Mobile Legends", "Legend → Mythic", "processing", "2026-11-26T12:00:00Z"),
  row(5, "Salsa Maharani", "salsa.moon", "Mobile Legends", "Classic Win Streak x10", "processing", "2026-11-26T13:45:00Z"),
  row(6, "Bayu Saputra", "bayuu", "Genshin Impact", "Spiral Abyss 36★", "waiting", "2026-11-26T16:20:00Z"),
  row(7, "Aulia Rahma", "aul.ia", "Mobile Legends", "Grandmaster → Epic", "waiting", "2026-11-26T19:00:00Z"),
  row(8, "Fajar Nugroho", "fajarn", "Mobile Legends", "Mythic Glory Push", "waiting", "2026-11-27T01:10:00Z"),
  row(9, "Citra Lestari", "citrass", "Honkai: Star Rail", "Memory of Chaos Clear", "waiting", "2026-11-27T03:30:00Z"),
  row(10, "Yoga Prasetyo", "yogaa.p", "Mobile Legends", "Hero Rank Medal", "waiting", "2026-11-27T05:55:00Z"),
];
