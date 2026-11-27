-- Roles
create type public.app_role as enum ('admin', 'moderator', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

-- First signed-in user may claim admin while no admin exists yet
create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if (select auth.uid()) is null then return false; end if;
  lock table public.user_roles in exclusive mode;
  if exists (select 1 from public.user_roles where role = 'admin') then return false; end if;
  insert into public.user_roles (user_id, role) values ((select auth.uid()), 'admin');
  return true;
end $$;
revoke execute on function public.claim_first_admin() from public, anon;
grant execute on function public.claim_first_admin() to authenticated;

create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;
revoke execute on function public.admin_exists() from public, anon;
grant execute on function public.admin_exists() to authenticated;

-- Full queue records (admin only)
create sequence public.queue_number_seq;
create table public.queue_entries (
  id uuid primary key default gen_random_uuid(),
  queue_number integer not null default nextval('public.queue_number_seq') unique,
  customer_name text not null,
  discord_username text not null,
  discord_id text not null default '',
  game text not null,
  service text not null,
  notes text not null default '',
  status text not null default 'waiting' check (status in ('waiting','processing','done')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
alter sequence public.queue_number_seq owned by public.queue_entries.queue_number;
grant usage on sequence public.queue_number_seq to authenticated, service_role;
grant select, insert, update, delete on public.queue_entries to authenticated;
grant all on public.queue_entries to service_role;
alter table public.queue_entries enable row level security;
create policy "Admins select queue" on public.queue_entries for select to authenticated using ((select public.has_role((select auth.uid()), 'admin')));
create policy "Admins insert queue" on public.queue_entries for insert to authenticated with check ((select public.has_role((select auth.uid()), 'admin')));
create policy "Admins update queue" on public.queue_entries for update to authenticated using ((select public.has_role((select auth.uid()), 'admin'))) with check ((select public.has_role((select auth.uid()), 'admin')));
create policy "Admins delete queue" on public.queue_entries for delete to authenticated using ((select public.has_role((select auth.uid()), 'admin')));
create index queue_entries_status_idx on public.queue_entries (status, queue_number);

-- Keep completed_at in sync with status
create or replace function public.queue_set_completed_at()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.status = 'done' and (tg_op = 'INSERT' or old.status <> 'done') then new.completed_at := coalesce(new.completed_at, now());
  elsif new.status <> 'done' then new.completed_at := null;
  end if;
  return new;
end $$;
create trigger queue_completed_at before insert or update on public.queue_entries
  for each row execute function public.queue_set_completed_at();

-- Public mirror: only fields safe to show everyone (no Discord ID, no notes)
create table public.queue_public (
  id uuid primary key,
  queue_number integer not null,
  customer_name text not null,
  discord_username text not null,
  game text not null,
  service text not null,
  status text not null,
  created_at timestamptz not null,
  completed_at timestamptz
);
grant select on public.queue_public to anon, authenticated;
grant all on public.queue_public to service_role;
alter table public.queue_public enable row level security;
create policy "Anyone can read public queue" on public.queue_public for select to anon, authenticated using (true);

create or replace function public.sync_queue_public()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    delete from public.queue_public where id = old.id;
    return old;
  end if;
  insert into public.queue_public (id, queue_number, customer_name, discord_username, game, service, status, created_at, completed_at)
  values (new.id, new.queue_number, new.customer_name, new.discord_username, new.game, new.service, new.status, new.created_at, new.completed_at)
  on conflict (id) do update set queue_number = excluded.queue_number, customer_name = excluded.customer_name,
    discord_username = excluded.discord_username, game = excluded.game, service = excluded.service,
    status = excluded.status, created_at = excluded.created_at, completed_at = excluded.completed_at;
  return new;
end $$;
revoke execute on function public.sync_queue_public() from public, anon, authenticated;
create trigger queue_public_sync after insert or update or delete on public.queue_entries
  for each row execute function public.sync_queue_public();

alter table public.queue_public replica identity full;
alter publication supabase_realtime add table public.queue_public;