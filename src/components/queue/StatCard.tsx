import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: LucideIcon }) {
  return (
    <div className="glass relative overflow-hidden rounded-md p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-primary" />
      </div>
      <p className="mt-3 font-display text-4xl font-semibold text-silver">{value}</p>
      <span className="ornament-line absolute inset-x-0 bottom-0" />
    </div>
  );
}
