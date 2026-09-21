# Base de datos - Supabase

**Responsable:** Nicolás  
**Estado:** autenticación, perfiles, donaciones, historial y necesidades de Fundación implementados

## Tablas implementadas

### `profiles`

| Campo | Tipo | Uso |
|---|---|---|
| `id` | uuid | PK y referencia a `auth.users.id`. |
| `full_name` | text | Nombre visible del usuario. |
| `role` | text | `donor`, `foundation` o `admin`. |
| `foundation_id` | text | Fundación asociada cuando el rol es Fundación. |
| `created_at` | timestamptz | Alta del perfil. |
| `updated_at` | timestamptz | Última modificación. |

El trigger `on_auth_user_created` crea el perfil automáticamente con rol `donor`.

### `donations`

Guarda la cabecera de cada donación: usuario, total, estado y fecha.

### `donation_items`

Guarda el detalle histórico por producto: producto, Fundación, cantidad y precio unitario. Los nombres se guardan como snapshot para que un historial antiguo no cambie si luego se modifica el catálogo.

### `foundation_needs`

Guarda las necesidades publicadas por una Fundación y la cantidad pendiente.

## Función `create_donation`

`public.create_donation(p_items jsonb)` crea la donación y todos sus ítems dentro de una misma transacción. El total se calcula en la base a partir de cantidades y precios recibidos. Solo puede ejecutarla un usuario autenticado.

## Seguridad / RLS

- un donante solo puede leer sus propias donaciones e ítems;
- una cuenta de Fundación puede leer donaciones e ítems asignados a su `foundation_id`;
- una Fundación solo puede administrar necesidades de su propia Fundación;
- un usuario normal solo puede actualizar `full_name` en `profiles`;
- `role` y `foundation_id` no pueden modificarse desde la app por un usuario común;
- `handle_new_user()` no es ejecutable directamente por `public`, `anon` ni `authenticated`.

El Security Advisor no reporta advertencias de RLS/esquema relacionadas con estas tablas. Permanece una recomendación general de Supabase para habilitar protección contra contraseñas filtradas en la configuración de Auth.

## Archivos de migración

- `supabase/migrations/20260920_create_profiles_and_auth_trigger.sql`
- `supabase/migrations/20260921_secure_profile_updates.sql`
- `supabase/migrations/20260921_create_donations_and_items.sql`
- `supabase/migrations/20260921_add_foundation_account_data.sql`

## Variables de entorno

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Se usan únicamente claves publicables en la app móvil. Nunca se incluye una secret key/service role en Expo.
