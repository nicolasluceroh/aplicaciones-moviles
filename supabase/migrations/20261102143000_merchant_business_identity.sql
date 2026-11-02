-- Cuenta comercial editable y nombre público en los productos existentes/nuevos.
-- Ejecutar después de 20261102_add_merchant_products.sql.
-- No elimina ninguna publicación ni modifica las cuentas existentes de otros roles.

-- La política RLS ya limita cada perfil a su propietario. El permiso de columna
-- permite guardar business_name sin habilitar la edición de role/foundation_id.
grant update (business_name) on public.profiles to authenticated;

alter table public.profiles
  add constraint profiles_business_name_length_check
  check (business_name is null or char_length(btrim(business_name)) between 2 and 100);

-- Funciones de trigger en un esquema no expuesto a la API de datos.
create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

-- Nadie puede asignar un nombre comercial a una cuenta que no sea merchant.
create or replace function app_private.validate_business_name_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.business_name is distinct from old.business_name and new.role <> 'merchant' then
    raise exception 'La cuenta no está habilitada como comercio';
  end if;
  return new;
end;
$$;

revoke all on function app_private.validate_business_name_change() from public, anon, authenticated;

create trigger profiles_validate_business_name
before update of business_name on public.profiles
for each row execute function app_private.validate_business_name_change();

-- El nombre comercial se publica como un dato separado. Evitamos dar acceso
-- público a los perfiles de usuarios, que también contienen información privada.
alter table public.merchant_products
  add column if not exists merchant_name text not null default 'Comercio';

-- Completar las publicaciones que ya existían antes de esta ampliación.
update public.merchant_products mp
set merchant_name = coalesce(nullif(btrim(p.business_name), ''), 'Comercio')
from public.profiles p
where p.id = mp.merchant_id;

-- No permitir que el cliente suplante la identidad de otro comercio alterando
-- merchant_name: se determina exclusivamente desde el perfil propietario.
create or replace function app_private.set_merchant_product_public_name()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select coalesce(nullif(btrim(p.business_name), ''), 'Comercio')
    into new.merchant_name
  from public.profiles p
  where p.id = new.merchant_id and p.role = 'merchant';
  if not found then
    raise exception 'Solo los comercios habilitados pueden publicar productos';
  end if;
  return new;
end;
$$;

revoke all on function app_private.set_merchant_product_public_name() from public, anon, authenticated;

create trigger merchant_products_set_public_name
before insert or update on public.merchant_products
for each row execute function app_private.set_merchant_product_public_name();

-- Un comercio puede modificar su propio nombre desde Mis datos. El cambio se
-- refleja en todas sus publicaciones, incluidas las anteriores o pausadas.
create or replace function app_private.sync_merchant_name_on_profile_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role = 'merchant' and new.business_name is distinct from old.business_name then
    update public.merchant_products
    set merchant_name = coalesce(nullif(btrim(new.business_name), ''), 'Comercio')
    where merchant_id = new.id;
  end if;
  return new;
end;
$$;

revoke all on function app_private.sync_merchant_name_on_profile_change() from public, anon, authenticated;

create trigger profiles_sync_merchant_name
  after update of business_name on public.profiles
  for each row execute function app_private.sync_merchant_name_on_profile_change();
