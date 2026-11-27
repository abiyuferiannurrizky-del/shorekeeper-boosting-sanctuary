export interface ServiceItem { name: string; detail: string; eta: string }
export interface ServiceCategory { id: string; game: string; tagline: string; items: ServiceItem[] }

// Sample catalogue for the prototype; prices are intentionally not shown until provided.
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "mlbb",
    game: "Mobile Legends",
    tagline: "Rank pushes, win streaks and medal hunts handled by veteran pilots.",
    items: [
      { name: "Rank Boost", detail: "Epic, Legend and Mythic tiers", eta: "1–3 days" },
      { name: "Mythic Glory Push", detail: "Star-based pushes at the top ladder", eta: "3–7 days" },
      { name: "Classic Win Streak", detail: "Guaranteed streak packages", eta: "1–2 days" },
      { name: "Hero Rank Medal", detail: "Regional hero leaderboard titles", eta: "2–5 days" },
    ],
  },
  {
    id: "other",
    game: "Other Games",
    tagline: "Endgame clears and progression across gacha and action titles.",
    items: [
      { name: "Wuthering Waves", detail: "Tower of Adversity, Holograms, exploration", eta: "1–3 days" },
      { name: "Genshin Impact", detail: "Spiral Abyss 36★, Imaginarium Theater", eta: "1–2 days" },
      { name: "Honkai: Star Rail", detail: "Memory of Chaos, Pure Fiction, Apocalyptic Shadow", eta: "1–2 days" },
      { name: "Custom Request", detail: "Ask us on Discord for anything else", eta: "Varies" },
    ],
  },
];
