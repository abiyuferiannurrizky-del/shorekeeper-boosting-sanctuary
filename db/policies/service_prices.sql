-- Services & pricing catalogue, editable by admins, readable by everyone.
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  detail text not null default '',
  eta text not null default '',
  price text not null default '',
  sort int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "Anyone reads services" on public.services for select to anon, authenticated using (true);
create policy "Admins insert services" on public.services for insert to authenticated with check ((select public.has_role((select auth.uid()), 'admin')));
create policy "Admins update services" on public.services for update to authenticated using ((select public.has_role((select auth.uid()), 'admin'))) with check ((select public.has_role((select auth.uid()), 'admin')));
create policy "Admins delete services" on public.services for delete to authenticated using ((select public.has_role((select auth.uid()), 'admin')));
