# Pruebas funcionales

**Responsable de consolidación:** Nicolás  
**Aportes:** todo el equipo

La tabla reúne los recorridos que deben probarse desde la versión integrada de `main`. La columna Estado debe completarse después de ejecutar cada caso en Expo Go.

| ID | Requisito | Funcionalidad | Pasos resumidos | Resultado esperado | Estado |
|---|---|---|---|---|---|
| CP-001 | RF-001 | Abrir Home | Abrir app sin sesión | Se muestran productos y fundaciones | Pendiente de registrar |
| CP-002 | RF-002 | Buscar producto | Escribir parte del nombre | Se muestran coincidencias | Pendiente de registrar |
| CP-003 | RF-003 | Detalle de producto | Abrir un producto | Se muestran datos, precio y cantidad | Pendiente de registrar |
| CP-004 | RF-004 | Agregar al carrito | Elegir cantidad y agregar | El carrito conserva la cantidad elegida | Pendiente de registrar |
| CP-005 | RF-004 | Modificar carrito | Usar `+`, `-` y eliminar | Cantidades y total se actualizan correctamente | Pendiente de registrar |
| CP-006 | RF-005 | Fundación obligatoria | Intentar continuar sin destino | La app impide continuar e informa el motivo | Pendiente de registrar |
| CP-007 | RF-005 | Seleccionar fundación | Elegir destino en carrito | La fundación queda asociada al producto | Pendiente de registrar |
| CP-008 | RF-006 | Consultar fundación | Abrir una fundación | Se muestra su información | Pendiente de registrar |
| CP-009 | RF-007 | Registrar donante | Crear cuenta | Se crea usuario y perfil | Pendiente de registrar |
| CP-010 | RF-008 | Login/logout | Iniciar y cerrar sesión | Cuenta cambia de estado correctamente | Pendiente de registrar |
| CP-011 | RF-008 | Persistencia de sesión | Cerrar y abrir Expo Go | La sesión se recupera | Pendiente de registrar |
| CP-012 | RF-008 | Email sin confirmar | Intentar login | Se informa el motivo y se permite reenviar confirmación | Pendiente de registrar |
| CP-013 | RF-009 | Checkout | Revisar resumen y confirmar | Se muestra pago simulado y confirmación | Pendiente de registrar |
| CP-014 | RF-010 | Guardar donación | Confirmar checkout con sesión | Se crean `donations` y `donation_items` | Pendiente de registrar |
| CP-015 | RF-011 | Historial vacío | Usuario nuevo sin donaciones | No aparecen datos ficticios | Pendiente de registrar |
| CP-016 | RF-011 | Historial real | Crear una donación y abrir historial | Aparece la donación creada | Pendiente de registrar |
| CP-017 | RF-011 | Detalle de donación | Abrir una donación | Se muestran ítems, cantidades, precios y fundación | Pendiente de registrar |
| CP-018 | RF-012 | Acceso Fundación inválido | Intentar con rol `donor` | El acceso es rechazado | Pendiente de registrar |
| CP-019 | RF-012 | Acceso Fundación válido | Login con rol `foundation` | Abre Panel Fundación | Pendiente de registrar |
| CP-020 | RF-013 | Donaciones recibidas | Abrir panel de fundación | Se pueden consultar las donaciones destinadas a esa fundación | Pendiente de implementación/verificación |
| CP-021 | RF-014 | Gestionar necesidades | Agregar, modificar y eliminar | Los cambios persisten en Supabase | Pendiente de registrar |
| CP-022 | RF-015 | Cámara | Abrir cámara y tomar foto | Se solicita permiso y se muestra la imagen | Pendiente de registrar |
| CP-023 | RF-016 | GPS | Solicitar ubicación | Se obtienen coordenadas | Pendiente de registrar |
| CP-024 | RF-017 | Login comercio | Ingresar con cuenta `donor` desde acceso comercio | Se rechaza el acceso | Pendiente de probar |
| CP-025 | RF-017 | Login comercio autorizado | Ingresar con cuenta `merchant` | Se abre Panel Comercio | Pendiente de probar |
| CP-026 | RF-018 | Necesidades pendientes | Abrir panel comercial | Se muestran necesidades con `pending > 0` | Pendiente de probar |
| CP-027 | RF-019 | Publicar producto | Completar formulario ligado a necesidad | Se guarda en `merchant_products` | Pendiente de probar |
| CP-028 | RF-020 | Pausar / reactivar / borrar | Gestionar oferta propia | Supabase y catálogo reflejan estado | Pendiente de probar |
| CP-029 | RF-021 | Mostrar en catálogo | Abrir Inicio y Catálogo | La oferta activa aparece | Pendiente de probar |
| CP-030 | RF-021 | Fundación fija | Agregar producto comercial al carrito | El destino es la fundación de la necesidad | Pendiente de probar |
| CP-031 | RF-019 | Protección RLS | Editar publicación de otro comercio | Operación denegada o sin filas afectadas | Pendiente de probar |
| CP-032 | RF-019 | Necesidad agotada | Cambiar `pending` a cero | No admite nueva publicación y la anterior deja de mostrarse | Pendiente de probar |

## Validaciones técnicas realizadas

- Los archivos JS/JSX del proyecto fueron parseados después de la integración sin errores de sintaxis.
- Los imports relativos utilizados por la aplicación resuelven a archivos existentes.
- La función `create_donation()` fue ejecutada en una transacción de prueba con rol `authenticated` y luego revertida.
- Se verificó que un usuario autenticado puede actualizar `full_name` pero no elevar su propio `role`.
- Se verificó que las políticas RLS de donaciones no generen recursión entre `donations` y `donation_items`.
