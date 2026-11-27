import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/site/PageShell";
import { DISCORD_URL } from "@/components/site/links";
import { CATEGORY_INFO, GAME, groupByCategory, startingPrice } from "@/lib/services";
import { usePriceList } from "@/lib/services-store";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — BONGJOKI" },
      { name: "description", content: "Wuthering Waves boosting price list: account care, endgame, farming, builds and quests." },
      { property: "og:title", content: "Services — BONGJOKI" },
      { property: "og:description", content: "Wuthering Waves boosting price list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const prices = usePriceList();
  return (
    <PageShell>
      <PageHero eyebrow="Catalogue" title="SERVICES" subtitle="Choose your path. Every order is tracked live from the moment it enters the queue." />
      <div className="mx-auto max-w-7xl space-y-16 px-5 pt-12">
        <section>
          <p className="text-xs uppercase tracking-[0.4em] text-primary">{GAME}</p>
          <h2 className="mt-2 font-display text-4xl text-silver">Price List</h2>
          <p className="mt-2 text-muted-foreground">All prices in Rupiah. Ask on Discord for anything not listed.</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {groupByCategory(prices).map(([cat, items]) => (
              <div key={cat} className="glass relative overflow-hidden rounded-md">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border px-6 py-5">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-3xl text-silver">{cat}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{CATEGORY_INFO[cat] ?? ""}</p>
                  </div>
                  <p className="shrink-0 text-right text-[10px] uppercase tracking-[0.25em] text-muted-foreground">From<br /><span className="text-sm text-primary">{startingPrice(items)}</span></p>
                </div>
                <ul className="px-6 py-2">
                  {items.map((i) => (
                    <li key={i.name} className="border-b border-border/40 py-3 last:border-0">
                      <div className="flex items-baseline gap-3">
                        <span className="min-w-0 text-sm text-silver">{i.name}</span>
                        <span className="mb-1 flex-1 border-b border-dotted border-primary/25" />
                        <span className="shrink-0 font-semibold tabular-nums text-primary">{i.price || "Ask"}</span>
                      </div>
                      {i.detail && <span className="mt-1.5 inline-block rounded-sm border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] text-muted-foreground">{i.detail}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <div className="glass rounded-md p-8 text-center">
          <p className="font-display text-3xl text-silver">Ready to begin?</p>
          <p className="mt-2 text-muted-foreground">Orders are handled on our Discord.</p>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-sm border border-primary bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground">Order on Discord</a>
        </div>
      </div>
    </PageShell>
  );
}
