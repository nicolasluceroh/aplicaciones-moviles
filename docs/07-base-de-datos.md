# Base de datos - Supabase

**Responsable:** Nicolás  
**Estado:** autenticación, perfiles, donaciones, necesidades de fundación y catálogo comercial implementados (con Storage y RLS)

## Tablas implementadas

### `profiles`

| Campo | Tipo | Uso |
|---|---|---|
| `id` | uuid | PK y referencia a `auth.users.id`. |
| `full_name` | text | Nombre visible del usuario. |
| `role` | text | `donor`, `foundation` , `merchant` o `admin`. |
| `foundation_id` | text | Fundación asociada cuando corresponde. |
| `business_name` | text | Nombre público configurable por comercios habilitados; sincronizado con sus publicaciones. |
| `created_at` | timestamptz | Alta del perfil. |
| `updated_at` | timestamptz | Última modificación. |

El trigger `on_auth_user_created` crea el perfil automáticamente con rol `donor`.

### `donations`

Guarda la cabecera de cada donación: usuario donante, total, estado y fecha.

### `donation_items`

Guarda el detalle histórico de cada producto: producto, fundación, cantidad y precio unitario. Los nombres se almacenan como snapshot para que el historial anterior no cambie si luego se modifica el catálogo local.

### `merchant_products`

Ofertas de comercios: `merchant_id`, `need_id`, `merchant_name` (copia pública sincronizada desde el perfil), nombre, descripción, precio, categoría, estado, fechas y `image_paths` (hasta tres fotografías almacenadas en Supabase Storage). RLS permite publicar y editar únicamente al propietario con rol `merchant`, para necesidades con cantidad pendiente; el catálogo público solo lee ofertas activas vinculadas a necesidades vigentes.

### `foundation_needs`

Guarda las necesidades publicadas por una fundación y la cantidad pendiente. Las necesidades no constituyen productos del catálogo.

### Supabase Storage: `merchant-products`

Bucket público para servir fotografías comerciales. Las cargas se guardan bajo la carpeta del comercio propietario y sus permisos de escritura/eliminación se controlan mediante políticas sobre `storage.objects`. Las publicaciones almacenan las rutas en `merchant_products.image_paths`.

## Función `create_donation`

`public.create_donation(p_items jsonb)` crea la donación y sus ítems dentro de una misma transacción. La función valida que exista un usuario autenticado y que el listado contenga ítems válidos. El total se calcula en la base a partir de cantidades y precios.

## Seguridad / RLS

- un donante solo puede leer sus propias donaciones e ítems;
- una cuenta de fundación puede leer los registros asociados a su `foundation_id`;
- una fundación solo puede administrar sus propias necesidades;
- los donantes y fundaciones pueden modificar sus datos de perfil permitidos; una cuenta `merchant` puede actualizar además su propio `business_name`, sin cambiar `role` ni `foundation_id`;
- los triggers validan y propagan el nombre comercial a `merchant_products.merchant_name`, sin exponer la tabla de perfiles públicamente;
- `role` y `foundation_id` no pueden modificarse desde la app por un usuario común;
- `handle_new_user()` no es ejecutable directamente por `public`, `anon` ni `authenticated`;
- las comprobaciones de acceso entre `donations` y `donation_items` usan funciones auxiliares del esquema `private` para evitar dependencias recursivas entre políticas RLS.

## Archivos de migración

- `supabase/migrations/20260920_create_profiles_and_auth_trigger.sql`
- `supabase/migrations/20260921_secure_profile_updates.sql`
- `supabase/migrations/20260921_create_donations_and_items.sql`
- `supabase/migrations/20260921_validate_donation_items.sql`
- `supabase/migrations/20260921_add_foundation_account_data.sql`
- `supabase/migrations/20260921_fix_donation_rls_recursion.sql`
- `supabase/migrations/20261102_add_merchant_products.sql`
- `supabase/migrations/20261102120000_add_merchant_product_images.sql`
- `supabase/migrations/20261102143000_merchant_business_identity.sql`

## Variables de entorno

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

La aplicación utiliza únicamente la clave publicable. Las claves secretas o `service_role` no forman parte del código móvil.

Los pasos de migración y habilitación administrativa están en `09-comercios.md`.
