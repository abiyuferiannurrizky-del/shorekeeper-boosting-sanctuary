import { describe, expect, it } from "vitest";
import { activeQueue, nextQueueNumber } from "@/lib/queue/logic";
import { parseCsv, validateImport } from "@/lib/queue/csv";
import type { QueueEntry } from "@/lib/queue/types";

const mk = (n: number, status: QueueEntry["status"]): QueueEntry => ({
  id: String(n), queue_number: n, customer_name: "C" + n, discord_username: "u" + n, discord_id: "",
  game: "ML", service: "Rank", notes: "", status, created_at: "2026-01-01T00:00:00Z", completed_at: null,
});
const SAMPLE_QUEUE = [mk(1, "done"), mk(2, "waiting"), mk(3, "processing"), mk(10, "waiting")];

describe("queue rules", () => {
  it("hides completed orders and puts processing first", () => {
    const q = activeQueue(SAMPLE_QUEUE);
    expect(q.some((e) => e.status === "done")).toBe(false);
    expect(q[0]?.status).toBe("processing");
  });
  it("assigns the next queue number", () => {
    expect(nextQueueNumber(SAMPLE_QUEUE)).toBe(11);
  });
  it("flags missing fields and duplicates on import", () => {
    const t = parseCsv(
      "customer_name,discord_username,discord_id,game,service\nA,a,123456789012345678,ML,Rank\nB,b,123456789012345678,ML,Rank\n,c,123456789012345679,ML,Rank",
    );
    const r = validateImport(t, []);
    expect(r[0]?.errors).toEqual([]);
    expect(r[1]?.errors).toContain("Duplicate of an active order");
    expect(r[2]?.errors).toContain("customer_name is required");
  });
});
