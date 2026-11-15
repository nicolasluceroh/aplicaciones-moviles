-- Integra el stock comercial y las cantidades pendientes con el checkout.
-- merchant_product_id es nullable para conservar el historial previo y usa
-- ON DELETE SET NULL para no perder snapshots cuando se elimina una publicación.

alter table public.donation_items
  add column if not exists merchant_product_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'donation_items_merchant_product_id_fkey'
      and conrelid = 'public.donation_items'::regclass
  ) then
    alter table public.donation_items
      add constraint donation_items_merchant_product_id_fkey
      foreign key (merchant_product_id)
      references public.merchant_products(id)
      on delete set null;
  end if;
end $$;

create index if not exists donation_items_merchant_product_idx
  on public.donation_items(merchant_product_id)
  where merchant_product_id is not null;

create or replace function public.create_donation(p_items jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_donation_id uuid;
  v_total numeric(12,2);
begin
  if v_user_id is null then
    raise exception 'Debés iniciar sesión para confirmar la donación';
  end if;

  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'La donación debe contener al menos un producto';
  end if;

  -- Valida formato básico y que cada ítem identifique una publicación comercial.
  if exists (
    with parsed as (
      select
        case
          when x.merchant_product_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
            then x.merchant_product_id::uuid
          when x.product_id ~* '^merchant:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
            then substring(x.product_id from 10)::uuid
          else null
        end as merchant_product_id,
        x.quantity
      from jsonb_to_recordset(p_items) as x(
        merchant_product_id text,
        product_id text,
        foundation_name text,
        quantity integer
      )
    )
    select 1 from parsed
    where merchant_product_id is null or quantity is null or quantity <= 0
  ) then
    raise exception 'Hay un producto inválido en la donación';
  end if;

  -- Bloquea productos y necesidades en orden estable para evitar carreras de stock.
  perform mp.id
  from public.merchant_products mp
  join (
    select distinct case
      when x.merchant_product_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then x.merchant_product_id::uuid
      else substring(x.product_id from 10)::uuid
    end as product_id
    from jsonb_to_recordset(p_items) as x(merchant_product_id text, product_id text)
  ) requested on requested.product_id = mp.id
  order by mp.id
  for update of mp;

  perform fn.id
  from public.foundation_needs fn
  where fn.id in (
    select distinct mp.need_id
    from public.merchant_products mp
    join (
      select distinct case
        when x.merchant_product_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then x.merchant_product_id::uuid
        else substring(x.product_id from 10)::uuid
      end as product_id
      from jsonb_to_recordset(p_items) as x(merchant_product_id text, product_id text)
    ) requested on requested.product_id = mp.id
  )
  order by fn.id
  for update of fn;

  -- Comprueba existencia, publicación activa y stock agregado por producto.
  if exists (
    with parsed as (
      select
        case
          when x.merchant_product_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
            then x.merchant_product_id::uuid
          else substring(x.product_id from 10)::uuid
        end as product_id,
        x.quantity
      from jsonb_to_recordset(p_items) as x(merchant_product_id text, product_id text, quantity integer)
    ), requested as (
      select product_id, sum(quantity)::integer as quantity
      from parsed group by product_id
    )
    select 1
    from requested r
    left join public.merchant_products mp on mp.id = r.product_id
    where mp.id is null or not mp.is_active or mp.stock < r.quantity
  ) then
    raise exception 'Uno de los productos ya no está disponible o no tiene stock suficiente';
  end if;

  -- Comprueba que la suma solicitada para cada necesidad no supere su pendiente.
  if exists (
    with parsed as (
      select
        case
          when x.merchant_product_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
            then x.merchant_product_id::uuid
          else substring(x.product_id from 10)::uuid
        end as product_id,
        x.quantity
      from jsonb_to_recordset(p_items) as x(merchant_product_id text, product_id text, quantity integer)
    ), requested as (
      select mp.need_id, sum(p.quantity)::integer as quantity
      from parsed p
      join public.merchant_products mp on mp.id = p.product_id
      group by mp.need_id
    )
    select 1
    from requested r
    join public.foundation_needs fn on fn.id = r.need_id
    where fn.pending <= 0 or fn.pending < r.quantity
  ) then
    raise exception 'La cantidad solicitada supera lo que la fundación necesita actualmente';
  end if;

  -- El importe siempre se toma del precio vigente en la base, no del cliente.
  select sum(mp.price * p.quantity)::numeric(12,2)
  into v_total
  from (
    select
      case
        when x.merchant_product_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then x.merchant_product_id::uuid
        else substring(x.product_id from 10)::uuid
      end as product_id,
      x.quantity
    from jsonb_to_recordset(p_items) as x(merchant_product_id text, product_id text, quantity integer)
  ) p
  join public.merchant_products mp on mp.id = p.product_id;

  insert into public.donations (donor_id, total, status)
  values (v_user_id, v_total, 'confirmed')
  returning id into v_donation_id;

  insert into public.donation_items (
    donation_id,
    product_id,
    merchant_product_id,
    product_name,
    foundation_id,
    foundation_name,
    quantity,
    unit_price
  )
  select
    v_donation_id,
    coalesce(nullif(x.product_id, ''), 'merchant:' || mp.id::text),
    mp.id,
    mp.name,
    fn.foundation_id,
    coalesce(nullif(btrim(x.foundation_name), ''), 'Fundación'),
    x.quantity,
    mp.price
  from jsonb_to_recordset(p_items) as x(
    merchant_product_id text,
    product_id text,
    foundation_name text,
    quantity integer
  )
  join public.merchant_products mp on mp.id = case
    when x.merchant_product_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      then x.merchant_product_id::uuid
    else substring(x.product_id from 10)::uuid
  end
  join public.foundation_needs fn on fn.id = mp.need_id;

  -- Descuenta stock por publicación.
  with parsed as (
    select
      case
        when x.merchant_product_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then x.merchant_product_id::uuid
        else substring(x.product_id from 10)::uuid
      end as product_id,
      x.quantity
    from jsonb_to_recordset(p_items) as x(merchant_product_id text, product_id text, quantity integer)
  ), requested as (
    select product_id, sum(quantity)::integer as quantity
    from parsed group by product_id
  )
  update public.merchant_products mp
  set stock = mp.stock - r.quantity
  from requested r
  where mp.id = r.product_id;

  -- Descuenta unidades pendientes por necesidad. El trigger de auditoría registra cada cambio.
  with parsed as (
    select
      case
        when x.merchant_product_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then x.merchant_product_id::uuid
        else substring(x.product_id from 10)::uuid
      end as product_id,
      x.quantity
    from jsonb_to_recordset(p_items) as x(merchant_product_id text, product_id text, quantity integer)
  ), requested as (
    select mp.need_id, sum(p.quantity)::integer as quantity
    from parsed p
    join public.merchant_products mp on mp.id = p.product_id
    group by mp.need_id
  )
  update public.foundation_needs fn
  set pending = fn.pending - r.quantity
  from requested r
  where fn.id = r.need_id;

  -- Si la necesidad quedó cubierta, ninguna publicación asociada debe seguir visible.
  update public.merchant_products mp
  set is_active = false
  where mp.need_id in (
    select fn.id
    from public.foundation_needs fn
    where fn.pending = 0
      and fn.id in (
        select distinct mp2.need_id
        from public.donation_items di
        join public.merchant_products mp2 on mp2.id = di.merchant_product_id
        where di.donation_id = v_donation_id
      )
  )
  and mp.is_active = true;

  return v_donation_id;
end;
$$;

revoke execute on function public.create_donation(jsonb) from public;
revoke execute on function public.create_donation(jsonb) from anon;
grant execute on function public.create_donation(jsonb) to authenticated;
