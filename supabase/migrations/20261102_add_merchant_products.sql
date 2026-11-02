-- El alta de comercios requiere habilitación administrativa, igual que fundaciones.
-- Los usuarios nuevos siguen siendo 'donor' por defecto.
alter table public.profiles
  drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
    check (role in ('donor', 'foundation', 'merchant', 'admin'));
alter table public.profiles
  add column if not exists business_name text;

-- Las necesidades con unidades pendientes son visibles para comercios y donantes;
-- las fundaciones conservan el acceso a sus propias necesidades con pendiente 0.
grant select on public.foundation_needs to anon;
create policy "Anyone can read active foundation needs"
on public.foundation_needs
for select
to anon, authenticated
using (pending > 0);

create table public.merchant_products (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  need_id uuid not null references public.foundation_needs(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  price numeric(12,2) not null check (price > 0),
  category text not null default 'Otros' check (char_length(btrim(category)) between 2 and 60),
  emoji text not null default '🎁' check (char_length(emoji) <= 12),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index merchant_products_merchant_idx
  on public.merchant_products (merchant_id, created_at desc);
create index merchant_products_need_idx
  on public.merchant_products (need_id);
create index merchant_products_active_idx
  on public.merchant_products (is_active) where is_active;

create trigger merchant_products_set_updated_at
before update on public.merchant_products
for each row execute procedure public.set_updated_at();

alter table public.merchant_products enable row level security;
grant select on public.merchant_products to anon, authenticated;
grant insert, update, delete on public.merchant_products to authenticated;

-- Un producto es público solo mientras la necesidad sigue pendiente.
-- El comerciante puede ver sus propias ofertas pausadas para administrarlas.
create policy "Read published products or own merchant products"
on public.merchant_products
for select
to anon, authenticated
using (
  (is_active and exists (
    select 1 from public.foundation_needs n
    where n.id = merchant_products.need_id and n.pending > 0
  ))
  or merchant_id = (select auth.uid())
);

create policy "Merchants create their own products for active needs"
on public.merchant_products
for insert to authenticated
with check (
  merchant_id = (select auth.uid())
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'merchant'
  )
  and exists (
    select 1 from public.foundation_needs n
    where n.id = merchant_products.need_id and n.pending > 0
  )
);

create policy "Merchants edit their own products"
on public.merchant_products
for update to authenticated
using (
  merchant_id = (select auth.uid())
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'merchant'
  )
)
with check (
  merchant_id = (select auth.uid())
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'merchant'
  )
  and exists (
    select 1 from public.foundation_needs n
    where n.id = merchant_products.need_id and n.pending > 0
  )
);

create policy "Merchants delete their own products"
on public.merchant_products
for delete to authenticated
using (
  merchant_id = (select auth.uid())
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'merchant'
  )
);
