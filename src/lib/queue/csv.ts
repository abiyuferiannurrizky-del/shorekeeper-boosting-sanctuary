import type { NewQueueEntry, QueueEntry } from "./types";

export const EXPORT_COLUMNS = [
  "id", "queue_number", "customer_name", "discord_username", "discord_id",
  "game", "service", "notes", "status", "created_at", "completed_at",
] as const;

const esc = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(rows: QueueEntry[]): string {
  return [EXPORT_COLUMNS.join(","), ...rows.map((r) => EXPORT_COLUMNS.map((c) => esc(r[c])).join(","))].join("\n");
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cur); cur = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cur); cur = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else cur += ch;
  }
  row.push(cur);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

export const REQUIRED_FIELDS = ["customer_name", "discord_username", "discord_id", "game", "service"] as const;

export interface ImportRow { line: number; data: NewQueueEntry; errors: string[] }

/** Validates rows; flags missing fields and duplicates (same Discord ID + service already active or repeated in the file). */
export function validateImport(table: string[][], existing: QueueEntry[]): ImportRow[] {
  const [header, ...body] = table;
  if (!header) return [];
  const idx = (k: string) => header.findIndex((h) => h.trim().toLowerCase() === k);
  const missingCols = REQUIRED_FIELDS.filter((f) => idx(f) === -1);
  const seen = new Set(existing.filter((e) => e.status !== "done").map((e) => `${e.discord_id}|${e.service.toLowerCase()}`));
  return body.map((cells, i) => {
    const get = (k: string) => { const j = idx(k); return j === -1 ? "" : (cells[j] ?? "").trim(); };
    const data: NewQueueEntry = {
      customer_name: get("customer_name"),
      discord_username: get("discord_username").replace(/^@/, ""),
      discord_id: get("discord_id"),
      game: get("game"),
      service: get("service"),
      notes: get("notes"),
    };
    const errors: string[] = missingCols.map((c) => `Missing column "${c}"`);
    for (const f of REQUIRED_FIELDS) if (!missingCols.includes(f) && !data[f]) errors.push(`${f} is required`);
    if (data.discord_id && !/^\d{17,20}$/.test(data.discord_id)) errors.push("discord_id must be 17–20 digits");
    const key = `${data.discord_id}|${data.service.toLowerCase()}`;
    if (data.discord_id && seen.has(key)) errors.push("Duplicate of an active order");
    seen.add(key);
    return { line: i + 2, data, errors };
  });
}
