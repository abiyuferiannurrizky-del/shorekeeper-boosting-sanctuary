import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Gamepad2, Swords } from "lucide-react";
import portrait from "@/assets/shorekeeper-portrait.jpg.asset.json";
import { Atmosphere, OrnamentDivider } from "@/components/brand/Atmosphere";
import { QueueTable } from "@/components/queue/QueueTable";
import { PageShell } from "@/components/site/PageShell";
import { activeQueue } from "@/lib/queue/logic";
import { useQueue } from "@/lib/queue/store";
import { CATEGORY_INFO, groupByCategory, startingPrice } from "@/lib/services";
import { usePriceList } from "@/lib/services-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BONGJOKI — Premium Gaming Boosting Service" },
      { name: "description", content: "Your journey, our resonance. Premium Wuthering Waves boosting with a live public queue." },
      { property: "og:title", content: "BONGJOKI — Premium Gaming Boosting Service" },
      { property: "og:description", content: "Your journey, our resonance. Premium boosting with a live public queue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const btnPrimary = "inline-flex items-center gap-2 rounded-sm border border-primary bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110";
const btnGhost = "inline-flex items-center gap-2 rounded-sm border border-silver/30 px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-silver transition hover:border-primary hover:text-primary";

function Home() {
  const prices = usePriceList();
  const preview = activeQueue(useQueue()).slice(0, 3);
  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <Atmosphere />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-14 pb-20 md:grid-cols-[1.1fr_0.9fr] md:pt-20">
          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-[0.45em] text-primary">Black Shores · Boosting Division</p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-wide text-silver sm:text-6xl lg:text-7xl">
              YOUR JOURNEY,<br /><span className="glow-text text-primary">OUR RESONANCE.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">Premium Gaming Boosting Service.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/queue" className={btnPrimary}>View Queue <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/services" className={btnGhost}>Explore Services</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-full bg-glow/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-t-[999px] border border-silver/20 shadow-[var(--shadow-glow)]">
              <img src={portrait.url} alt="Shorekeeper walking on a glowing shore under a starry sky" className="aspect-[3/4.4] w-full object-cover object-[50%_30%]" fetchPriority="high" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background to-transparent" />
            </div>
            <p className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.5em] text-muted-foreground">Shorekeeper · Guardian</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <OrnamentDivider label="Services" />
        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-muted-foreground">Wuthering Waves only — every pilot knows Solaris inside out.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groupByCategory(prices).map(([cat, items], i) => {
            const Icon = [Swords, Gamepad2, Swords, Gamepad2][i % 4]!;
            return (
              <Link key={cat} to="/services" className="glass group relative overflow-hidden rounded-md p-7 transition hover:border-primary/50 hover:shadow-[var(--shadow-glow)]">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-6 font-display text-3xl text-silver">{cat}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{CATEGORY_INFO[cat] ?? ""}</p>
                <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">From <span className="text-primary">{startingPrice(items)}</span></p>
                <p className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
                  {items.length} services <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </p>
                <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-primary/20 transition group-hover:scale-110" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <OrnamentDivider label="Now in Queue" />
        <div className="mt-10"><QueueTable entries={preview} /></div>
        <div className="mt-8 text-center">
          <Link to="/queue" className={btnGhost}>See Full Queue <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </PageShell>
  );
}
