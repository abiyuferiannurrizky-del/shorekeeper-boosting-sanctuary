import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QueueEntry } from "@/lib/queue/types";
import { StatusBadge } from "./StatusBadge";

export function QueueEmpty({ message = "The shore is calm — no active orders right now." }: { message?: string }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-md px-6 py-14 text-center">
      <Sparkles className="h-6 w-6 text-primary" />
      <p className="font-display text-2xl text-silver">{message}</p>
      <p className="text-sm text-muted-foreground">New orders will appear here as soon as they are added.</p>
    </div>
  );
}

export function QueueTable({ entries }: { entries: QueueEntry[] }) {
  if (entries.length === 0) return <QueueEmpty />;
  return (
    <>
      {/* Desktop table */}
      <div className="glass hidden overflow-hidden rounded-md md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <th className="px-5 py-4 font-medium">No.</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Discord</th>
              <th className="px-5 py-4 font-medium">Service</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr
                key={e.id}
                className={cn(
                  "animate-row-in border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40",
                  e.status === "processing" && "bg-glow/[0.06]",
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <td className="px-5 py-4 font-display text-xl text-primary">#{String(e.queue_number).padStart(3, "0")}</td>
                <td className="px-5 py-4 font-medium text-silver">{e.customer_name}</td>
                <td className="px-5 py-4 text-muted-foreground">@{e.discord_username}</td>
                <td className="px-5 py-4">
                  <div className="text-silver">{e.service}</div>
                  <div className="text-xs text-muted-foreground">{e.game}</div>
                </td>
                <td className="px-5 py-4"><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {entries.map((e) => (
          <li key={e.id} className={cn("glass animate-row-in rounded-md p-4", e.status === "processing" && "border-glow/50")}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="font-display text-lg text-primary">#{String(e.queue_number).padStart(3, "0")}</p>
                <p className="truncate font-medium text-silver">{e.customer_name}</p>
                <p className="truncate text-xs text-muted-foreground">@{e.discord_username}</p>
              </div>
              <StatusBadge status={e.status} />
            </div>
            <p className="mt-3 text-sm text-silver">{e.service} <span className="text-muted-foreground">· {e.game}</span></p>
          </li>
        ))}
      </ul>
    </>
  );
}
