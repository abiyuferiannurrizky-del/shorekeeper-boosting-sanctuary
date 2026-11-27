import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Hourglass, Layers, Loader } from "lucide-react";
import { QueueTable } from "@/components/queue/QueueTable";
import { StatCard } from "@/components/queue/StatCard";
import { PageHero, PageShell } from "@/components/site/PageShell";
import { activeQueue, queueStats } from "@/lib/queue/logic";
import { useLastUpdated, useQueue } from "@/lib/queue/store";

export const Route = createFileRoute("/queue")({
  head: () => ({
    meta: [
      { title: "Live Queue — BONGJOKI" },
      { name: "description", content: "Track the progress of your BONGJOKI boosting order in real time." },
      { property: "og:title", content: "Live Queue — BONGJOKI" },
      { property: "og:description", content: "Track the progress of your order in real time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QueuePage,
});

function QueuePage() {
  const entries = useQueue();
  const updated = useLastUpdated();
  const stats = queueStats(entries);
  return (
    <PageShell>
      <PageHero
        eyebrow="Black Shores Queue System"
        title="LIVE QUEUE"
        subtitle="Track the progress of your order in real time."
        aside={
          <div className="space-y-1 text-right text-xs text-muted-foreground">
            <p className="inline-flex items-center gap-2 uppercase tracking-[0.2em] text-glow">
              <span className="animate-pulse-dot h-2 w-2 rounded-full bg-glow" /> Connected · Demo data
            </p>
            <p>Last updated {updated ? new Date(updated).toLocaleTimeString() : "—"}</p>
          </div>
        }
      />
      <div className="mx-auto max-w-7xl space-y-10 px-5 pt-12">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Active queues" value={stats.active} icon={Layers} />
          <StatCard label="Processing" value={stats.processing} icon={Loader} />
          <StatCard label="Waiting" value={stats.waiting} icon={Hourglass} />
          <StatCard label="Completed today" value={stats.completedToday} icon={CheckCircle2} />
        </div>
        <QueueTable entries={activeQueue(entries)} />
      </div>
    </PageShell>
  );
}
