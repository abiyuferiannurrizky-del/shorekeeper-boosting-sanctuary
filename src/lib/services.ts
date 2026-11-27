export const GAME = "Wuthering Waves";

/** Short blurbs per price-list category, shown on the homepage and Services page. */
export const CATEGORY_INFO: Record<string, string> = {
  "Rawat Akun": "Daily upkeep of your account — dailies, weeklies and events kept clean.",
  "Endgame": "Whimpering Wastes, Tower of Adversity and Hologram clears.",
  "Farm & Build": "Echo farming and full Resonator builds tuned for damage.",
  "Quest": "Main, exploration, companion and side quests completed for you.",
};

/** Lowest-looking price in a group, for "from" labels: the first price string. */
export function startingPrice(items: { price: string }[]): string {
  const nums = items.map((i) => ({ p: i.price, n: Number((i.price.match(/[\d.]+/)?.[0] ?? "").replace(/\./g, "")) })).filter((x) => x.n > 0);
  if (nums.length === 0) return "";
  const min = nums.reduce((a, b) => (b.n < a.n ? b : a));
  return min.p.split("–")[0]!.trim();
}

export interface PriceItem { category: string; name: string; detail: string; eta: string; price: string }

/** Wuthering Waves price list from the owner's sheet; used until prices are saved in the admin editor. */
export const DEFAULT_PRICE_LIST: PriceItem[] = [
  ["Rawat Akun", "Rawat — 1 Hari", "", "Rp 2.000"],
  ["Rawat Akun", "Rawat — 1 Minggu", "", "Rp 13.000"],
  ["Rawat Akun", "Rawat — 1 Bulan", "Include ToA, Whiwa", "Rp 50.000"],
  ["Rawat Akun", "Rawat — 1 Bulan VIP", "Include Event, ToA, Whiwa", "Rp 150.000"],
  ["Rawat Akun", "Rawat — 1 Patch", "Include semuanya", "Rp 200.000"],
  ["Endgame", "Whimpering Wastes — Infinite Torrent Floor 12", "", "Rp 5.000"],
  ["Endgame", "Whimpering Wastes — All Clear", "Cek akun dulu", "Rp 15.000"],
  ["Endgame", "Whimpering Wastes — Pre Order", "", "Rp 10.000"],
  ["Endgame", "ToA Overdrive — Per Floor", "", "Rp 4.000"],
  ["Endgame", "ToA Overdrive — All Clear", "Cek akun dulu", "Rp 20.000"],
  ["Endgame", "ToA Hazard — All Clear", "", "Rp 15.000"],
  ["Endgame", "ToA Hazard — Pre Order", "Cek akun dulu", "Rp 10.000"],
  ["Endgame", "Hologram — All Huanglong", "All Holo Diff 1–4 free; dihitung hanya Diff 5 dan 6", "Rp 20.000"],
  ["Endgame", "Hologram — Per Holo Huanglong", "Dihitung hanya Diff 5 dan 6", "Rp 5.000"],
  ["Endgame", "Hologram — All Rinascita", "Jika tersisa Diff 6 (free)", "Rp 40.000"],
  ["Endgame", "Hologram — Per Holo Rinascita", "", "Rp 10.000"],
  ["Farm & Build", "Farm Echo — 30 Menit", "", "Rp 20.000"],
  ["Farm & Build", "Farm Echo — Cost 4 / 8 Drop", "", "Rp 5.000"],
  ["Farm & Build", "Build Resonator — DPS", "Prioritas double crit", "Rp 80.000 – Rp 100.000"],
  ["Farm & Build", "Build Resonator — Sub DPS", "", "Rp 30.000 – Rp 40.000"],
  ["Farm & Build", "Build Resonator — Support / Healer", "", "Rp 20.000"],
  ["Quest", "Main Quest", "", "Rp 10.000 / Act"],
  ["Quest", "Exploration Quest", "", "Rp 10.000 / Quest"],
  ["Quest", "Companion Quest", "", "Rp 5.000 / Quest"],
  ["Quest", "Side Quest", "", "Rp 4.000 / Quest"],
].map(([category, name, detail, price]) => ({ category: category!, name: name!, detail: detail!, eta: "", price: price! }));

/** Group items by category, keeping first-seen order. */
export function groupByCategory<T extends { category: string }>(items: T[]): [string, T[]][] {
  const m = new Map<string, T[]>();
  for (const i of items) m.set(i.category, [...(m.get(i.category) ?? []), i]);
  return [...m.entries()];
}
