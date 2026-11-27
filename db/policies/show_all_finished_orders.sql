-- Public history: show every finished order, not only the last 30 days.
--
-- The queue_public mirror only ever holds columns that are safe to show
-- everyone (no discord_id, no notes), so finished orders can be public for
-- any age. The predicate still has to mean something: a "done" row must
-- actually carry its completion timestamp, which the queue_completed_at
-- trigger always sets.
--
-- Run this in the SQL editor of the connected Supabase project, or hand it
-- to Lovable so it can apply the schema change (the schema is managed).

drop policy if exists "Public can read active and recent orders" on public.queue_public;
drop policy if exists "Anyone can read public queue" on public.queue_public;

create policy "Public can read active and all finished orders" on public.queue_public
  for select to anon, authenticated
  using (status in ('waiting', 'processing') or (status = 'done' and completed_at is not null));
