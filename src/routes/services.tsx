import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { PageHero, PageShell } from "@/components/site/PageShell";
import { DISCORD_URL } from "@/components/site/links";
import { SERVICE_CATEGORIES, groupByCategory } from "@/lib/services";
import { usePriceList } from "@/lib/services-store";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — BONGJOKI" },
      { name: "description", content: "Boosting services for Mobile Legends, Wuthering Waves, Genshin Impact, Honkai: Star Rail and more." },
      { property: "og:title", content: "Services — BONGJOKI" },
      { property: "og:description", content: "Boosting services for Mobile Legends and other games." },
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
        {SERVICE_CATEGORIES.map((c) => (
          <section key={c.id}>
            <h2 className="font-display text-4xl text-silver">{c.game}</h2>
            <p className="mt-2 text-muted-foreground">{c.tagline}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {c.items.map((s) => (
                <article key={s.name} className="glass flex flex-col rounded-md p-6 transition hover:-translate-y-0.5 hover:border-primary/50">
                  <h3 className="font-display text-2xl text-silver">{s.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.detail}</p>
                  <p className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary"><Clock className="h-3.5 w-3.5" /> {s.eta}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
        <section>
          <h2 className="font-display text-4xl text-silver">Price List</h2>
          <p className="mt-2 text-muted-foreground">Wuthering Waves rates.</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {groupByCategory(prices).map(([cat, items]) => (
              <div key={cat} className="glass rounded-md p-6">
                <h3 className="font-display text-2xl text-silver">{cat}</h3>
                <ul className="mt-4 divide-y divide-border/60">
                  {items.map((i) => (
                    <li key={i.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm text-silver">{i.name}</p>
                        {i.detail && <p className="mt-0.5 text-xs text-muted-foreground">{i.detail}</p>}
                      </div>
                      <p className="shrink-0 text-right text-sm font-semibold text-primary">{i.price || "Ask on Discord"}</p>
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
