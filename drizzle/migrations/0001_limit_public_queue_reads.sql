drop policy "Anyone can read public queue" on public.queue_public;
create policy "Public can read active and recent orders" on public.queue_public
  for select to anon, authenticated
  using (status in ('waiting', 'processing') or (status = 'done' and completed_at > now() - interval '30 days'));
create index if not exists queue_public_status_completed_idx on public.queue_public (status, completed_at);