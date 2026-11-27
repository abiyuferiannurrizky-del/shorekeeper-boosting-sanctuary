import { cn } from "@/lib/utils";
import { STATUS_LABEL, type QueueStatus } from "@/lib/queue/types";

const styles: Record<QueueStatus, string> = {
  waiting: "border-waiting/30 bg-waiting/10 text-waiting",
  processing: "border-glow/60 bg-glow/15 text-glow shadow-[var(--shadow-glow)]",
  done: "border-success/40 bg-success/10 text-success",
};

export function StatusBadge({ status, className }: { status: QueueStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em]", styles[status], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", status === "processing" && "animate-pulse-dot")} />
      {STATUS_LABEL[status]}
    </span>
  );
}
