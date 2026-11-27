import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { NewQueueEntry } from "@/lib/queue/types";

const EMPTY: NewQueueEntry = { customer_name: "", discord_username: "", discord_id: "", game: "Mobile Legends", service: "", notes: "" };

export function QueueFormDialog({ open, onOpenChange, initial, onSubmit, title }: {
  open: boolean; onOpenChange: (o: boolean) => void; initial?: NewQueueEntry; title: string; onSubmit: (v: NewQueueEntry) => void | Promise<void>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-display text-2xl">{title}</DialogTitle></DialogHeader>
        {open && <FormBody initial={initial ?? EMPTY} onSubmit={onSubmit} />}
      </DialogContent>
    </Dialog>
  );
}

function FormBody({ initial, onSubmit }: { initial: NewQueueEntry; onSubmit: (v: NewQueueEntry) => void | Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [v, setV] = useState(initial);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof NewQueueEntry) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!v.customer_name.trim() || !v.discord_username.trim() || !v.game.trim() || !v.service.trim()) return setErr("Fill in name, Discord username, game and service.");
    if (v.discord_id && !/^\d{17,20}$/.test(v.discord_id.trim())) return setErr("Discord User ID must be 17–20 digits.");
    setBusy(true);
    void Promise.resolve(onSubmit({ ...v, discord_username: v.discord_username.replace(/^@/, "").trim(), discord_id: v.discord_id.trim() })).finally(() => setBusy(false));
  };
  const field = (k: keyof NewQueueEntry, label: string, ph = "") => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} value={v[k]} onChange={set(k)} placeholder={ph} />
    </div>
  );
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("customer_name", "Customer name")}
        {field("discord_username", "Discord username", "username")}
        {field("discord_id", "Discord User ID", "17–20 digits")}
        {field("game", "Game")}
      </div>
      {field("service", "Service details", "e.g. Epic → Legend")}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={v.notes} onChange={set("notes")} rows={3} />
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
    </form>
  );
}
