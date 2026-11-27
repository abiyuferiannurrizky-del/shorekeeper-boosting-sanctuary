import { ArrowUpDown, CheckCircle2, Download, Layers, Loader, Pencil, Play, Plus, Trash2, Upload, ListOrdered } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/queue/StatCard";
import { StatusBadge } from "@/components/queue/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseCsv, toCsv, validateImport, type ImportRow } from "@/lib/queue/csv";
import { completedOrders, queueStats } from "@/lib/queue/logic";
import { queueActions, useQueue } from "@/lib/queue/store";
import type { QueueEntry, QueueStatus } from "@/lib/queue/types";
import { Confirm } from "./ConfirmButton";
import { QueueFormDialog } from "./QueueForm";

const num = (n: number) => `#${String(n).padStart(3, "0")}`;

export function OverviewSection() {
  const entries = useQueue();
  const s = queueStats(entries);
  const recent = [...entries].sort((a, b) => (b.completed_at ?? b.created_at).localeCompare(a.completed_at ?? a.created_at)).slice(0, 6);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total orders" value={s.total} icon={ListOrdered} />
        <StatCard label="Active" value={s.active} icon={Layers} />
        <StatCard label="Processing" value={s.processing} icon={Loader} />
        <StatCard label="Completed" value={s.completed} icon={CheckCircle2} />
      </div>
      <div className="glass rounded-md">
        <h3 className="border-b border-border px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Recent activity</h3>
        <ul>
          {recent.map((e) => (
            <li key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-5 py-3 text-sm last:border-0">
              <span className="min-w-0 truncate"><span className="text-primary">{num(e.queue_number)}</span> {e.customer_name} — {e.service}</span>
              <StatusBadge status={e.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function QueueSection() {
  const entries = useQueue();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | QueueStatus>("all");
  const [asc, setAsc] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<QueueEntry | null>(null);

  const rows = useMemo(
    () => entries
      .filter((e) => status === "all" || e.status === status)
      .filter((e) => e.customer_name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (asc ? 1 : -1) * (a.queue_number - b.queue_number)),
    [entries, q, status, asc],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input placeholder="Search customer name…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setAsc((a) => !a)}><ArrowUpDown className="h-4 w-4" /> No. {asc ? "↑" : "↓"}</Button>
        <Button className="sm:ml-auto" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add queue</Button>
      </div>

      <div className="glass overflow-x-auto rounded-md">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="px-4 py-3">No.</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Discord</th>
              <th className="px-4 py-3">Service</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No orders match.</td></tr>}
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                <td className="px-4 py-3 text-primary">{num(e.queue_number)}</td>
                <td className="px-4 py-3">{e.customer_name}</td>
                <td className="px-4 py-3 text-muted-foreground">@{e.discord_username}<div className="text-xs">{e.discord_id}</div></td>
                <td className="px-4 py-3">{e.service}<div className="text-xs text-muted-foreground">{e.game}</div></td>
                <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {e.status === "waiting" && (
                      <Button size="sm" variant="ghost" title="Mark as processing" onClick={() => { queueActions.setStatus(e.id, "processing"); toast.success(`${num(e.queue_number)} is now processing`); }}><Play className="h-4 w-4" /></Button>
                    )}
                    {e.status !== "done" && (
                      <Button size="sm" variant="ghost" title="Mark as completed" onClick={() => { queueActions.setStatus(e.id, "done"); toast.success(`${num(e.queue_number)} completed`); }}><CheckCircle2 className="h-4 w-4" /></Button>
                    )}
                    <Button size="sm" variant="ghost" title="Edit" onClick={() => setEditing(e)}><Pencil className="h-4 w-4" /></Button>
                    <Confirm
                      trigger={<Button size="sm" variant="ghost" title="Remove"><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                      title={`Remove ${num(e.queue_number)}?`}
                      description={`${e.customer_name}'s order will be permanently removed.`}
                      action="Remove"
                      onConfirm={() => { queueActions.remove(e.id); toast.success("Order removed"); }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QueueFormDialog open={adding} onOpenChange={setAdding} title="Add queue"
        onSubmit={(v) => { const e = queueActions.add(v); setAdding(false); toast.success(`Added ${num(e.queue_number)}`); }} />
      <QueueFormDialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)} title="Edit queue" {...(editing ? { initial: editing } : {})}
        onSubmit={(v) => { if (editing) queueActions.update(editing.id, v); setEditing(null); toast.success("Order updated"); }} />
    </div>
  );
}

export function HistorySection() {
  const done = completedOrders(useQueue());
  return (
    <div className="glass overflow-x-auto rounded-md">
      <table className="w-full min-w-[640px] text-sm">
        <thead><tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <th className="px-4 py-3">No.</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Completed</th><th className="px-4 py-3" />
        </tr></thead>
        <tbody>
          {done.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No completed orders yet.</td></tr>}
          {done.map((e) => (
            <tr key={e.id} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-3 text-primary">{num(e.queue_number)}</td>
              <td className="px-4 py-3">{e.customer_name}<div className="text-xs text-muted-foreground">@{e.discord_username}</div></td>
              <td className="px-4 py-3">{e.service}</td>
              <td className="px-4 py-3 text-muted-foreground">{e.completed_at ? new Date(e.completed_at).toLocaleString() : "—"}</td>
              <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost" onClick={() => queueActions.setStatus(e.id, "waiting")}>Reopen</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export function ImportExportSection() {
  const entries = useQueue();
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [fileErr, setFileErr] = useState<string | null>(null);
  const valid = rows?.filter((r) => r.errors.length === 0) ?? [];

  const onFile = async (f: File | undefined) => {
    setFileErr(null); setRows(null);
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) return setFileErr("Excel (.xlsx) import arrives in Phase 5 — please save the sheet as CSV for now.");
    const parsed = validateImport(parseCsv(await f.text()), entries);
    if (parsed.length === 0) return setFileErr("The file has no data rows.");
    setRows(parsed);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass space-y-4 rounded-md p-6">
        <h3 className="flex items-center gap-2 font-display text-2xl"><Upload className="h-5 w-5 text-primary" /> Import</h3>
        <p className="text-sm text-muted-foreground">CSV with columns: customer_name, discord_username, discord_id, game, service, notes (optional).</p>
        <Input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => onFile(e.target.files?.[0])} />
        {fileErr && <p className="text-sm text-destructive">{fileErr}</p>}
        {rows && (
          <>
            <div className="max-h-72 overflow-auto rounded-sm border border-border">
              <table className="w-full text-xs">
                <thead><tr className="text-left text-muted-foreground"><th className="p-2">Line</th><th className="p-2">Customer</th><th className="p-2">Service</th><th className="p-2">Check</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.line} className="border-t border-border">
                      <td className="p-2">{r.line}</td><td className="p-2">{r.data.customer_name || "—"}</td><td className="p-2">{r.data.service || "—"}</td>
                      <td className={r.errors.length ? "p-2 text-destructive" : "p-2 text-success"}>{r.errors.length ? r.errors.join("; ") : "OK"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button disabled={valid.length === 0} onClick={() => { queueActions.addMany(valid.map((r) => r.data)); toast.success(`Imported ${valid.length} orders`); setRows(null); }}>
              Import {valid.length} valid row{valid.length === 1 ? "" : "s"}
            </Button>
          </>
        )}
      </div>
      <div className="glass space-y-4 rounded-md p-6">
        <h3 className="flex items-center gap-2 font-display text-2xl"><Download className="h-5 w-5 text-primary" /> Export (CSV)</h3>
        <p className="text-sm text-muted-foreground">XLSX export is planned for Phase 5.</p>
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={() => download("bongjoki-active.csv", toCsv(entries.filter((e) => e.status !== "done")))}>Active queue</Button>
          <Button variant="outline" onClick={() => download("bongjoki-completed.csv", toCsv(completedOrders(entries)))}>Completed orders</Button>
          <Button variant="outline" onClick={() => download("bongjoki-all.csv", toCsv(entries))}>All records</Button>
        </div>
      </div>
    </div>
  );
}

export function SettingsSection() {
  const overlayUrl = typeof window !== "undefined" ? `${window.location.origin}/overlay` : "/overlay";
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass space-y-3 rounded-md p-6">
        <h3 className="font-display text-2xl">OBS overlay</h3>
        <p className="text-sm text-muted-foreground">Add a Browser Source in OBS with this URL, size 1920 × 1080.</p>
        <div className="flex gap-2">
          <Input readOnly value={overlayUrl} />
          <Button variant="outline" onClick={() => { void navigator.clipboard.writeText(overlayUrl); toast.success("Copied"); }}>Copy</Button>
        </div>
      </div>
      <div className="glass space-y-3 rounded-md p-6">
        <h3 className="font-display text-2xl">Demo data</h3>
        <p className="text-sm text-muted-foreground">This prototype keeps orders in this browser only. Restore the sample orders at any time.</p>
        <Confirm trigger={<Button variant="outline">Reset sample data</Button>} title="Reset demo data?" description="All changes made in this browser are replaced by the sample orders." action="Reset" onConfirm={() => { queueActions.resetDemo(); toast.success("Sample data restored"); }} />
      </div>
    </div>
  );
}
