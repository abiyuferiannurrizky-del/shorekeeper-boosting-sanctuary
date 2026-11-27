import { useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { groupByCategory } from "@/lib/services";
import { defaultDrafts, serviceActions, useServices, type ServiceRow } from "@/lib/services-store";
import { Confirm } from "./ConfirmButton";

export function ServicesSection() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useServices();
  const run = async (fn: () => Promise<unknown>, ok: string) => {
    try { await fn(); toast.success(ok); void qc.invalidateQueries({ queryKey: ["services"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Something went wrong"); }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading services…</p>;
  if (error) return <div className="glass rounded-md p-6 text-sm text-muted-foreground">Couldn't load services. The pricing table may not be set up on the database yet.</div>;
  const rows = data ?? [];

  if (rows.length === 0) {
    return (
      <div className="glass space-y-4 rounded-md p-8 text-center">
        <p className="font-display text-2xl text-silver">No saved prices yet</p>
        <p className="text-sm text-muted-foreground">Start from your current price list, then edit anything you like.</p>
        <Button onClick={() => run(() => serviceActions.addMany(defaultDrafts()), "Service list created")}>Load price list</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {groupByCategory(rows).map(([cat, items]) => {
        return (
          <section key={cat} className="space-y-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h3 className="truncate font-display text-2xl text-silver">{cat}</h3>
              <Button size="sm" variant="outline" onClick={() => run(() => serviceActions.add({ category: cat, name: "New service", detail: "", eta: "", price: "", sort: rows.length }), "Service added")}>
                <Plus className="mr-1 h-4 w-4" /> Add service
              </Button>
            </div>
            <div className="hidden grid-cols-[1.2fr_1.6fr_0.8fr_0.9fr_auto] gap-2 px-1 text-xs uppercase tracking-[0.2em] text-muted-foreground lg:grid">
              <span>Name</span><span>Details</span><span>Time</span><span>Price</span><span className="w-20" />
            </div>
            {items.map((r) => <ServiceRowEditor key={r.id} row={r} run={run} />)}
          </section>
        );
      })}
      <Button variant="outline" onClick={() => { const cat = window.prompt("New category name"); if (cat?.trim()) void run(() => serviceActions.add({ category: cat.trim(), name: "New service", detail: "", eta: "", price: "", sort: rows.length }), "Category added"); }}>
        <Plus className="mr-1 h-4 w-4" /> Add category
      </Button>
    </div>
  );
}

function ServiceRowEditor({ row, run }: { row: ServiceRow; run: (fn: () => Promise<unknown>, ok: string) => Promise<void> }) {
  const [d, setD] = useState(row);
  useEffect(() => setD(row), [row]);
  const dirty = d.name !== row.name || d.detail !== row.detail || d.eta !== row.eta || d.price !== row.price;
  const set = (k: keyof ServiceRow) => (e: React.ChangeEvent<HTMLInputElement>) => setD({ ...d, [k]: e.target.value });
  return (
    <div className="glass grid gap-2 rounded-md p-3 lg:grid-cols-[1.2fr_1.6fr_0.8fr_0.9fr_auto] lg:items-center">
      <Input aria-label="Service name" value={d.name} onChange={set("name")} />
      <Input aria-label="Details" value={d.detail} onChange={set("detail")} placeholder="Details" />
      <Input aria-label="Time" value={d.eta} onChange={set("eta")} placeholder="1–3 days" />
      <Input aria-label="Price" value={d.price} onChange={set("price")} placeholder="Rp 50.000" />
      <div className="flex gap-2">
        <Button size="icon" disabled={!dirty || !d.name.trim()} aria-label="Save" onClick={() => run(() => serviceActions.update(row.id, { name: d.name.trim(), detail: d.detail, eta: d.eta, price: d.price.trim() }), "Saved")}>
          <Save className="h-4 w-4" />
        </Button>
        <Confirm title={`Remove ${row.name}?`} description="It will disappear from the Services page." action="Remove" onConfirm={() => void run(() => serviceActions.remove(row.id), "Service removed")}
          trigger={<Button size="icon" variant="outline" aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>} />
      </div>
    </div>
  );
}
