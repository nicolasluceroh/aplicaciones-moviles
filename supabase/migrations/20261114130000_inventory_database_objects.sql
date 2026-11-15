-- Objetos de inventario y objetos PostgreSQL utilizados en la entrega de Base de Datos.
-- Diseñada para ser segura tanto sobre una base nueva como sobre el proyecto donde
-- estos objetos pudieron haberse creado previamente desde SQL Editor.

alter table public.merchant_products
  add column if not exists stock integer not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'merchant_products_stock_nonnegative'
      and conrelid = 'public.merchant_products'::regclass
  ) then
    alter table public.merchant_products
      add constraint merchant_products_stock_nonnegative check (stock >= 0);
  end if;
end $$;

comment on column public.merchant_products.stock is
  'Unidades disponibles ofrecidas por el comercio.';

-- Compatibilidad con publicaciones creadas antes de existir stock: el modelo
-- anterior solo tenía como límite las unidades pendientes de la necesidad.
update public.merchant_products mp
set stock = fn.pending
from public.foundation_needs fn
where fn.id = mp.need_id
  and mp.stock = 0
  and mp.is_active = true
  and fn.pending > 0;

create or replace view public.v_catalogo_productos_disponibles
with (security_invoker = true)
as
select
  mp.id as product_id,
  mp.name as product_name,
  mp.description,
  mp.price,
  mp.category,
  mp.emoji,
  mp.image_paths,
  mp.stock,
  mp.merchant_id,
  mp.merchant_name,
  fn.id as need_id,
  fn.name as need_name,
  fn.foundation_id,
  fn.pending as need_pending,
  mp.created_at,
  mp.updated_at
from public.merchant_products mp
join public.foundation_needs fn on fn.id = mp.need_id
where mp.is_active = true
  and mp.stock > 0
  and fn.pending > 0;

revoke all on public.v_catalogo_productos_disponibles from public;
grant select on public.v_catalogo_productos_disponibles to anon, authenticated, service_role;

create table if not exists public.auditoria_necesidades (
  auditoria_id bigint generated always as identity primary key,
  need_id uuid not null references public.foundation_needs(id),
  pending_anterior integer,
  pending_nuevo integer,
  fecha_cambio timestamptz not null default now(),
  usuario_id uuid null
);

alter table public.auditoria_necesidades enable row level security;
revoke all on public.auditoria_necesidades from public, anon, authenticated;
grant all on public.auditoria_necesidades to service_role;
revoke all on sequence public.auditoria_necesidades_auditoria_id_seq from public, anon, authenticated;
grant all on sequence public.auditoria_necesidades_auditoria_id_seq to service_role;

create index if not exists auditoria_necesidades_need_id_idx
  on public.auditoria_necesidades(need_id);

create or replace function app_private.audit_foundation_need_pending()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.auditoria_necesidades
    (need_id, pending_anterior, pending_nuevo, usuario_id)
  values
    (new.id, old.pending, new.pending, auth.uid());
  return new;
end;
$$;

revoke all on function app_private.audit_foundation_need_pending() from public, anon, authenticated;
grant execute on function app_private.audit_foundation_need_pending() to service_role;

drop trigger if exists trg_auditar_necesidad on public.foundation_needs;
create trigger trg_auditar_necesidad
after update of pending on public.foundation_needs
for each row
when (old.pending is distinct from new.pending)
execute function app_private.audit_foundation_need_pending();

create or replace procedure public.sp_cerrar_necesidad(p_need_id uuid)
language plpgsql
set search_path = ''
as $$
begin
  if p_need_id is null then
    raise exception 'Debe indicar una necesidad';
  end if;

  perform 1
  from public.foundation_needs
  where id = p_need_id and pending > 0
  for update;

  if not found then
    raise exception 'Necesidad inexistente o ya cubierta';
  end if;

  update public.foundation_needs
  set pending = 0
  where id = p_need_id;

  update public.merchant_products
  set is_active = false
  where need_id = p_need_id and is_active = true;
end;
$$;

revoke all on procedure public.sp_cerrar_necesidad(uuid) from public, anon, authenticated;
grant execute on procedure public.sp_cerrar_necesidad(uuid) to service_role;
