import type { ReactNode } from "react";
import { Atmosphere, OrnamentDivider } from "@/components/brand/Atmosphere";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle, aside }: { eyebrow: string; title: string; subtitle: string; aside?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <Atmosphere butterflies={false} />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-20">
        <p className="text-[11px] uppercase tracking-[0.4em] text-primary">{eyebrow}</p>
        <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-5xl font-semibold tracking-wide text-silver md:text-6xl">{title}</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">{subtitle}</p>
          </div>
          {aside}
        </div>
        <div className="mt-10"><OrnamentDivider /></div>
      </div>
    </section>
  );
}
