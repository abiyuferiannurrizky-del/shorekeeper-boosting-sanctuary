import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { PageHero, PageShell } from "@/components/site/PageShell";
import { DISCORD_URL } from "@/components/site/links";
import { SERVICE_CATEGORIES } from "@/lib/services";

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
        <div className="glass rounded-md p-8 text-center">
          <p className="font-display text-3xl text-silver">Ready to begin?</p>
          <p className="mt-2 text-muted-foreground">Orders and pricing are handled on our Discord.</p>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-sm border border-primary bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground">Order on Discord</a>
        </div>
      </div>
    </PageShell>
  );
}
