import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Butterfly";
import { DISCORD_URL } from "./links";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">Premium gaming boosting service. Your journey, our resonance.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-[11px] uppercase tracking-[0.25em] text-primary">Service</p>
          <Link to="/services" className="block text-muted-foreground hover:text-silver">Boosting services</Link>
          <Link to="/queue" className="block text-muted-foreground hover:text-silver">Live queue</Link>
          <Link to="/history" className="block text-muted-foreground hover:text-silver">Completed orders</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-[11px] uppercase tracking-[0.25em] text-primary">Community</p>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-silver">Join our Discord</a>
          <p className="text-muted-foreground">Orders are placed and tracked through Discord.</p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs tracking-[0.2em] text-muted-foreground">
        © 2026 BONGJOKI · Fan-inspired design. Wuthering Waves artwork © Kuro Games.
      </div>
    </footer>
  );
}
