import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Butterfly";
import { activeQueue } from "@/lib/queue/logic";
import { useQueue } from "@/lib/queue/store";
import { DISCORD_URL } from "./links";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/queue", label: "Queue" },
  { to: "/history", label: "History" },
] as const;

export function LiveIndicator() {
  const count = activeQueue(useQueue()).length;
  return (
    <Link to="/queue" className="inline-flex items-center gap-2 rounded-sm border border-glow/40 bg-glow/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-glow">
      <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-glow" />
      Live Queue · {count}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const linkCls = "text-sm tracking-[0.12em] text-muted-foreground transition-colors hover:text-silver";
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Link to="/" aria-label="BONGJOKI home"><Logo /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={{ className: "!text-primary" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className={linkCls}>Discord</a>
        </nav>
        <div className="flex items-center gap-3">
          <LiveIndicator />
          <button className="text-silver md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border px-5 py-4 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className={linkCls}>Discord</a>
        </nav>
      )}
    </header>
  );
}
