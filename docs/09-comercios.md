# Acceso de comercios y publicaciones vinculadas a necesidades

**Fecha:** 2026-11-02  
**Requisitos:** RF-017 a RF-021

## Objetivo

Permitir que un comercio habilitado inicie sesión con Supabase Auth, vea necesidades de las fundaciones con cantidad pendiente y publique artículos concretos para que los donantes los encuentren en el catálogo. No se modifica el checkout simulado ni el catálogo local preexistente.

## Flujo de uso

1. Una persona registra una cuenta con email y contraseña (la creación pública mantiene `role = 'donor'`).
2. Un administrador verifica la cuenta y le asigna `role = 'merchant'` y `business_name` en Supabase.
3. Desde **Mi cuenta → Comercios → Acceso para comercios**, el comercio inicia sesión.
4. En **Panel Comercio**, elige una de las necesidades publicadas que tengan `pending > 0`, completa nombre, descripción, categoría y precio, y publica.
5. La app guarda la oferta en `public.merchant_products` con `merchant_id` y `need_id`. La publicación activa aparece en Inicio, Catálogo y la pantalla de la fundación correspondiente.
6. El donante puede agregar el producto al carrito. La fundación queda asignada automáticamente según la necesidad; no puede cambiarse por otra desde el carrito.
7. El comercio puede pausar, reactivar o eliminar sus propias ofertas. Al quedar una necesidad sin unidades pendientes, la oferta deja de mostrarse públicamente aunque siga registrada.

> El comercio puede crear su cuenta pública como donante y luego pedir habilitación. Un parámetro de navegación o la metadata de registro NO habilitan por sí solos un rol de comercio.

## Migración de base de datos

Archivo: `supabase/migrations/20261102_add_merchant_products.sql`.

**Antes de ejecutar la app actualizada**, aplicá la migración al mismo proyecto Supabase que utiliza tu `.env`. Si manejás las migraciones con Supabase CLI y ya tenés el proyecto vinculado:

```bash
npx supabase db push
```

Alternativa: ejecutá el contenido del archivo de migración una sola vez en **Supabase Dashboard → SQL Editor**. Antes de hacerlo en producción, probalo en una instancia de desarrollo y conservá un respaldo. **Incluir la migración en Git no modifica automáticamente la base de datos remota.**

La migración:

- incorpora el rol `merchant` y el dato `profiles.business_name`;
- agrega una política para consultar necesidades con `pending > 0`;
- crea `merchant_products` con referencias a `profiles` y `foundation_needs`;
- activa RLS: solo el comercio autenticado puede crear, editar o borrar sus publicaciones, y solo para necesidades pendientes;
- permite lectura pública de ofertas activas cuyas necesidades siguen pendientes;
- crea índices y la actualización de `updated_at`.

### Habilitar una cuenta comercial

1. Registrar la cuenta desde la app y confirmar el email (o crear la cuenta desde Authentication en Supabase).
2. En **Supabase SQL Editor**, ejecutar con privilegios de administración, reemplazando los valores de ejemplo:

```sql
update public.profiles p
set role = 'merchant', business_name = 'Nombre del comercio'
from auth.users u
where u.id = p.id
  and lower(u.email) = lower('comercio@ejemplo.com');
```

3. Comprobar que la consulta haya actualizado **exactamente una fila**. Cerrar y volver a abrir sesión en el acceso para comercios.

**No ejecutar esa consulta desde el cliente móvil.** La aplicación usa exclusivamente la clave pública y no puede otorgarse permisos elevados a sí misma.

## Modelo

| Campo | Descripción |
|---|---|
| `merchant_products.id` | UUID de la publicación. |
| `merchant_id` | Propietario; FK a `profiles`. |
| `need_id` | Necesidad atendida; FK a `foundation_needs`. |
| `name`, `description`, `category`, `emoji` | Información del producto. |
| `price` | Precio unitario positivo en ARS. |
| `is_active` | Estado de publicación. |
| `created_at`, `updated_at` | Auditoría temporal. |

Si una fundación **elimina** una necesidad, sus ofertas relacionadas se eliminan en cascada. Los ítems de donaciones anteriores conservan los nombres, cantidades y precios históricos como snapshots.

## Archivos de código

- `src/screens/MerchantPanelScreen.js`: ofertas y CRUD propio.
- `src/screens/LoginScreen.js`: acceso específico según rol (`donor`, `foundation`, `merchant`).
- `src/screens/AccountScreen.js`: acceso al panel comercial.
- `src/hooks/useCatalogProducts.js`: integra ofertas persistidas con productos locales.
- `src/screens/HomeScreen.js`, `CatalogScreen.js`, `FoundationScreen.js`, `ProductScreen.js`: visualización.
- `src/context/CartContext.js`, `src/screens/CartScreen.js`, `CheckoutScreen.js`: destino de una publicación vinculado a la fundación de su necesidad.
- `src/context/AuthContext.js`: lectura de `business_name`.
- `App.js`: ruta `MerchantPanel`.

## Restricciones y pendientes

- Esta versión no implementa verificación documental ni alta automática de comercios: la habilitación es manual, como para las fundaciones.
- Se mantienen los productos locales de demostración existentes; **los nuevos productos de comercios sí se guardan en Supabase**.
- No incorpora fotos ni stock propio del comercio: se usa el ícono/emoji del catálogo y la cantidad pendiente de la fundación.
- El checkout continúa siendo simulado y el procedimiento `create_donation` preexistente confía en los precios remitidos por el cliente. Para cobrar importes reales debe validarse oferta, precio y disponibilidad del lado del servidor.
- No se han ejecutado pruebas end-to-end contra un proyecto Supabase remoto desde esta entrega. Se requieren pruebas en Expo Go con migración aplicada y cuentas reales.

## Pruebas manuales prioritarias

1. Donante sin sesión: puede abrir Inicio y ver los productos publicados activos.
2. Donante intenta acceder al login comercial: se rechaza y se cierra esa sesión.
3. Comercio habilitado: inicia sesión y accede al panel.
4. Selecciona una necesidad pendiente, publica producto y verifica nueva fila en `merchant_products`.
5. La oferta aparece en Inicio, Catálogo y fundación correcta; se puede agregar al carrito, con destinatario bloqueado.
6. Pausa oferta: desaparece del catálogo; puede reactivarla.
7. Intenta usar otro usuario para editar/borrar la oferta (consulta Supabase con sesión ajena): RLS lo impide.
8. Fundación deja `pending = 0`: su oferta deja de aparecer en catálogo y no se puede crear una nueva oferta para esa necesidad.
9. Verificar que registro/login de donantes, panel de fundación, carrito y donaciones previos siguen operativos.
