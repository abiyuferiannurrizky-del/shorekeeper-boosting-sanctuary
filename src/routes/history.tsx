import { createFileRoute } from "@tanstack/react-router";
import { QueueEmpty } from "@/components/queue/QueueTable";
import { StatusBadge } from "@/components/queue/StatusBadge";
import { PageHero, PageShell } from "@/components/site/PageShell";
import { completedOrders } from "@/lib/queue/logic";
import { useQueue } from "@/lib/queue/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Order History — BONGJOKI" },
      { name: "description", content: "Recently completed BONGJOKI boosting orders." },
      { property: "og:title", content: "Order History — BONGJOKI" },
      { property: "og:description", content: "Recently completed boosting orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const done = completedOrders(useQueue());
  return (
    <PageShell>
      <PageHero eyebrow="Archive" title="ORDER HISTORY" subtitle="Every journey completed by the BONGJOKI team." />
      <div className="mx-auto max-w-5xl px-5 pt-12">
        {done.length === 0 ? (
          <QueueEmpty message="No completed orders yet." />
        ) : (
          <ol className="relative space-y-4 border-l border-border pl-6">
            {done.map((e) => (
              <li key={e.id} className="glass animate-row-in relative rounded-md p-5">
                <span className="absolute top-6 -left-[29px] h-2.5 w-2.5 rotate-45 border border-success bg-background" />
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-xl text-silver">#{String(e.queue_number).padStart(3, "0")} · {e.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{e.service} · {e.game} · @{e.discord_username}</p>
                  </div>
                  <StatusBadge status="done" />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Completed {e.completed_at ? new Date(e.completed_at).toLocaleString() : "—"}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </PageShell>
  );
}
