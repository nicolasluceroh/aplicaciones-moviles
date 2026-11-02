# Acceso de comercios y publicaciones vinculadas a necesidades

**Fecha:** 2026-11-02  
**Requisitos:** RF-017 a RF-021

## Objetivo

Permitir que un comercio habilitado inicie sesión con Supabase Auth, vea necesidades de las fundaciones con cantidad pendiente y publique artículos concretos para que los donantes los encuentren en el catálogo. El checkout continúa siendo simulado. El catálogo público ahora muestra exclusivamente los productos publicados por comercios.

## Flujo de uso

1. Una persona registra una cuenta con email y contraseña (la creación pública mantiene `role = 'donor'`).
2. Un administrador verifica la cuenta y le asigna `role = 'merchant'` y `business_name` en Supabase.
3. Desde **Mi cuenta → Comercios → Acceso para comercios**, el comercio inicia sesión.
4. En **Panel Comercio**, elige primero la fundación y luego una de sus necesidades con `pending > 0`; completa nombre, descripción, categoría, precio y fotografías, y publica.
5. La app guarda la oferta en `public.merchant_products` con `merchant_id` y `need_id`. La publicación activa aparece en Inicio, Catálogo y la pantalla de la fundación correspondiente.
6. El donante puede agregar el producto al carrito. La fundación queda asignada automáticamente según la necesidad; no puede cambiarse por otra desde el carrito.
7. El comercio puede **editar**, pausar, reactivar o eliminar sus propias ofertas. También puede actualizar el nombre comercial desde **Mis datos**, que se muestra en la ficha del producto. Al quedar una necesidad sin unidades pendientes, la oferta deja de mostrarse públicamente aunque siga registrada.

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
| `name`, `description`, `category` | Información del producto. |
| `image_paths` | Hasta tres rutas de fotos en Supabase Storage. |
| `merchant_name` | Nombre comercial público sincronizado desde `profiles.business_name`. |
| `price` | Precio unitario positivo en ARS. |
| `is_active` | Estado de publicación. |
| `created_at`, `updated_at` | Auditoría temporal. |

Si una fundación **elimina** una necesidad, sus ofertas relacionadas se eliminan en cascada. Los ítems de donaciones anteriores conservan los nombres, cantidades y precios históricos como snapshots.

## Archivos de código

- `src/screens/MerchantPanelScreen.js`: ofertas y CRUD propio.
- `src/screens/LoginScreen.js`: acceso específico según rol (`donor`, `foundation`, `merchant`).
- `src/screens/AccountScreen.js`: acceso al panel comercial.
- `src/hooks/useCatalogProducts.js`: expone exclusivamente los productos comerciales activos.
- `src/screens/HomeScreen.js`, `CatalogScreen.js`, `FoundationScreen.js`, `ProductScreen.js`: visualización.
- `src/context/CartContext.js`, `src/screens/CartScreen.js`, `CheckoutScreen.js`: destino de una publicación vinculado a la fundación de su necesidad.
- `src/context/AuthContext.js`: lectura de `business_name`.
- `App.js`: ruta `MerchantPanel`.

## Secuencia de migraciones comerciales

1. `supabase/migrations/20261102_add_merchant_products.sql` — rol y tabla de ofertas.
2. `supabase/migrations/20261102120000_add_merchant_product_images.sql` — bucket Storage, fotos y políticas.
3. `supabase/migrations/20261102143000_merchant_business_identity.sql` — edición de nombre comercial y sincronización pública.

El despliegue del código **no ejecuta automáticamente** estas migraciones en Supabase. Deben aplicarse en orden y verificarse antes de utilizar la funcionalidad.

## Restricciones y pendientes

- Esta versión no implementa verificación documental ni alta automática de comercios: la habilitación es manual, como para las fundaciones.
- `src/data/products.js` conserva datos de muestra pero ya no se usa en el catálogo público.
- La aplicación admite hasta tres fotos por producto; no implementa stock independiente de las cantidades pendientes que registra la fundación.
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

## Actualización: catálogo separado, selectores y fotografías

- El **catálogo** ya no utiliza `src/data/products.js`: contiene solo artículos realmente publicados por comercios y activos para necesidades pendientes.
- Las **necesidades** (`foundation_needs`) son pedidos de las fundaciones, no productos a la venta. Se muestran por separado en la pantalla de cada fundación.
- En el panel de comercio se selecciona **fundación** y luego **necesidad pendiente de esa fundación** mediante dos desplegables dependientes. Elegir otra fundación borra la necesidad anterior.
- El comercio define independientemente el nombre del producto, descripción, categoría y precio, y adjunta **entre una y tres fotos** desde la galería. Las fotos se guardan en el bucket público `merchant-products` de Supabase Storage, dentro de la carpeta de su `auth.uid()`.
- `merchant_products.image_paths` almacena las rutas de las fotos. El catálogo utiliza URLs públicas y la ficha del producto permite ver hasta tres fotos. Los productos publicados antes de esta ampliación conservan sus datos y aparecen con un marcador si todavía no tienen imágenes.
- Al eliminar una publicación se intenta eliminar también sus imágenes de Storage. Si una fundación elimina la necesidad, la eliminación en cascada borra la fila del producto, **pero no sus archivos**; esos objetos huérfanos deben limpiarse desde Storage.

### Instalación en Expo

Desde la rama de trabajo ejecutar **una vez**:

```bash
npx expo install expo-image-picker
npx expo start -c
```

`npx expo install` selecciona versiones compatibles con el SDK instalado. **La rama de este PR actualiza Expo a SDK 58**; `package.json`, `package-lock.json` y `app.json` forman parte del cambio. Esto permite probar la aplicación desde Expo Go en iOS, sin requerir una versión anterior del cliente. Antes de abrir el PR, verificar la instalación con `npx expo-doctor` y probar la navegación en el dispositivo.

### Migración adicional

Ejecutar en Supabase SQL Editor (una vez y **después** de la migración comercial anterior):

`supabase/migrations/20261102120000_add_merchant_product_images.sql`

Agrega `image_paths` a la tabla comercial existente y crea bucket y políticas RLS de Storage. No borra publicaciones ni necesidades previas. **No volver a ejecutar** sin comprobar la existencia de las políticas.

### Prueba recomendada

1. Iniciar sesión como fundación y crear una necesidad, por ejemplo `Mochila` con 5 unidades pendientes.
2. Comprobar que la necesidad **no aparece** como producto comercial en Inicio o Catálogo.
3. Iniciar sesión como comercio, elegir la fundación en el primer desplegable y `Mochila` en el segundo.
4. Completar `Mochila reforzada`, descripción, categoría, precio y de una a tres fotos; publicar.
5. Comprobar nueva fila en `merchant_products`, fotos en Storage y producto en Catálogo.
6. Verificar que la ficha del producto muestre las fotos, y que su carrito tenga la fundación asociada.
7. Pausar el producto y comprobar que desaparezca del catálogo; reactivarlo y volver a comprobar.

## Actualización: edición de publicaciones y nombre comercial

- En **Mi cuenta → Configuración del comercio** (o **Mis datos**), una cuenta habilitada con `role = 'merchant'` puede definir y modificar su **nombre comercial**. No cambia su nombre y apellido, rol, email ni los datos de otras cuentas.
- El nombre comercial se muestra en **Detalle del producto** como «Vendido por: ...». La tabla `merchant_products` guarda `merchant_name` como dato público sincronizado automáticamente desde `profiles.business_name`; no se amplían las políticas RLS de `profiles` a datos personales.
- En **Panel Comercio → Mis publicaciones**, cada producto incorpora la acción **Editar**. Permite modificar su nombre, descripción, categoría, precio, fundación/necesidad asociada y fotografías; los archivos anteriores que se reemplazan se eliminan después de guardar la actualización con éxito. Se conservan las opciones Pausar/Reactivar y Eliminar.
- El formulario de edición carga las fotos y el contenido que ya existen; **Cancelar edición** vuelve al formulario vacío. Los productos publicados anteriormente sin fotos se pueden seguir editando sin obligar a agregarlas en esa misma operación.
- Las modificaciones están protegidas por las políticas RLS preexistentes en `merchant_products`: un comercio solo puede actualizar sus propias publicaciones. La necesidad destino debe continuar abierta, con unidades pendientes.

### Migración adicional

`supabase/migrations/20261102143000_merchant_business_identity.sql`

Ejecutar **una sola vez**, después de las migraciones de productos y fotos. Concede permiso para cambiar únicamente la columna `business_name` del perfil propio y agrega `merchant_name` a las publicaciones. Incluye triggers para completar nombres de ofertas existentes y sincronizarlos cuando el comercio cambia su nombre. **No elimina publicaciones ni usuarios.** El cliente no puede establecer arbitrariamente el nombre público de una publicación.

### Pruebas de regresión

1. Como comercio, entrar a Configuración del comercio, guardar otro nombre y verificar que la cabecera del panel y la ficha de producto reflejen el cambio.
2. Seleccionar **Editar** en un producto propio, cambiar el precio y el título, conservar su foto y comprobar que la ficha muestre el cambio.
3. Reemplazar una foto y confirmar que la publicación sigue mostrando las restantes, y que en Storage no quedan los archivos sustituidos cuando la limpieza se completó correctamente.
4. Intentar editar una oferta de otro comercio: las políticas de Supabase deben impedirlo.
5. Confirmar que un donante o una fundación no puede cambiar su rol ni el nombre comercial de otra cuenta.
6. Verificar que el catálogo, el carrito, la creación de necesidades y las publicaciones antiguas siguen funcionando.
