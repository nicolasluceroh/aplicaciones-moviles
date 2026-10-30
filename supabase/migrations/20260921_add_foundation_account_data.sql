alter table public.profiles
  add column foundation_id text;

create table public.foundation_needs (
  id uuid primary key default gen_random_uuid(),
  foundation_id text not null,
  name text not null,
  pending integer not null default 1 check (pending >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.foundation_needs enable row level security;

grant select, insert, update, delete on public.foundation_needs to authenticated;

create policy "Foundation users can read own needs"
on public.foundation_needs
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('foundation', 'admin')
      and (p.role = 'admin' or p.foundation_id = foundation_needs.foundation_id)
  )
);

create policy "Foundation users can create own needs"
on public.foundation_needs
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('foundation', 'admin')
      and (p.role = 'admin' or p.foundation_id = foundation_needs.foundation_id)
  )
);

create policy "Foundation users can update own needs"
on public.foundation_needs
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('foundation', 'admin')
      and (p.role = 'admin' or p.foundation_id = foundation_needs.foundation_id)
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('foundation', 'admin')
      and (p.role = 'admin' or p.foundation_id = foundation_needs.foundation_id)
  )
);

create policy "Foundation users can delete own needs"
on public.foundation_needs
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('foundation', 'admin')
      and (p.role = 'admin' or p.foundation_id = foundation_needs.foundation_id)
  )
);

create policy "Foundation users can read assigned donation items"
on public.donation_items
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('foundation', 'admin')
      and (p.role = 'admin' or p.foundation_id = donation_items.foundation_id)
  )
);

create policy "Foundation users can read assigned donations"
on public.donations
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    join public.donation_items di on di.donation_id = donations.id
    where p.id = (select auth.uid())
      and p.role in ('foundation', 'admin')
      and (p.role = 'admin' or p.foundation_id = di.foundation_id)
  )
);

create trigger foundation_needs_set_updated_at
before update on public.foundation_needs
for each row execute procedure public.set_updated_at();

insert into public.foundation_needs (foundation_id, name, pending)
values
  ('1', 'Kit escolar', 10),
  ('1', 'Mochila escolar', 5);
