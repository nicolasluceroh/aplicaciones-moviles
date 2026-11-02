-- Ampliación del esquema comercial: hasta tres fotos por producto.
-- La migración anterior (20261102_add_merchant_products.sql) debe estar aplicada.
alter table public.merchant_products
  add column if not exists image_paths text[] not null default '{}'::text[];

alter table public.merchant_products
  drop constraint if exists merchant_products_image_count_check;
alter table public.merchant_products
  add constraint merchant_products_image_count_check
    check (cardinality(image_paths) <= 3);

-- Las imágenes son públicas para poder mostrarlas en el catálogo.
-- Solo comercios habilitados pueden subir a su propia carpeta (UUID del usuario).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'merchant-products', 'merchant-products', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;

create policy "Merchants upload their own product photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'merchant-products'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'merchant'
  )
);

-- Necesaria para que Storage permita eliminar archivos propios.
create policy "Merchants read their own photo objects"
on storage.objects for select to authenticated
using (
  bucket_id = 'merchant-products'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Merchants delete their own photo objects"
on storage.objects for delete to authenticated
using (
  bucket_id = 'merchant-products'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'merchant'
  )
);
