import { cn } from "@/lib/utils";

export function Butterfly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={cn("text-glow", className)} fill="none" aria-hidden="true">
      <path d="M32 24C24 6 6 2 4 10c-2 8 10 14 28 14Z" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="0.8" />
      <path d="M32 24C40 6 58 2 60 10c2 8-10 14-28 14Z" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="0.8" />
      <path d="M32 24c-6 4-18 10-16 18 2 6 12-2 16-18Z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="0.8" />
      <path d="M32 24c6 4 18 10 16 18-2 6-12-2-16-18Z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="0.8" />
      <path d="M32 14v22" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Butterfly className="h-6 w-8" />
      <span className="font-display text-xl font-semibold tracking-[0.28em] text-silver">BONGJOKI</span>
    </span>
  );
}
