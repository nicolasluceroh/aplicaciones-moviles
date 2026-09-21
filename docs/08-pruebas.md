# Pruebas funcionales

**Responsable de consolidación:** Nicolás  
**Aportes:** todo el equipo

| ID | Requisito | Funcionalidad | Pasos resumidos | Resultado esperado |
|---|---|---|---|---|
| CP-001 | RF-001 | Abrir Home | Abrir app | Se muestran productos sin login |
| CP-002 | RF-002 | Buscar producto | Escribir parte del nombre | Se muestran coincidencias |
| CP-003 | RF-004 | Agregar al carrito | Abrir detalle y agregar | Producto aparece en Carrito |
| CP-004 | RF-005 | Seleccionar fundación | Elegir destino en carrito | Se guarda la selección |
| CP-005 | RF-007 | Registrar donante | Crear cuenta y confirmar email | Se crea usuario y perfil |
| CP-006 | RF-008 | Login/logout | Iniciar y cerrar sesión | Cuenta cambia de estado correctamente |
| CP-007 | RF-008 | Persistencia de sesión | Cerrar y abrir Expo Go | La sesión sigue iniciada |
| CP-008 | RF-008 | Email sin confirmar | Intentar login | Se informa el motivo y permite reenviar confirmación |
| CP-009 | RF-010 | Guardar donación | Confirmar checkout con sesión | Se crean `donations` y `donation_items` |
| CP-010 | RF-011 | Historial vacío | Usuario nuevo sin donaciones | Mis Donaciones no muestra datos ficticios |
| CP-011 | RF-011 | Historial real | Crear una donación y abrir historial | Aparece la donación recién creada |
| CP-012 | RF-011 | Detalle de donación | Abrir una donación | Se muestran ítems, cantidades, precios y Fundación |
| CP-013 | RF-012 | Acceso Fundación | Login con rol donor | El acceso es rechazado |
| CP-014 | RF-012 | Acceso Fundación válido | Login con rol foundation + foundation_id | Abre Panel Fundación |
| CP-015 | RF-014 | Gestionar necesidades | Agregar/modificar/eliminar | Cambios persisten en Supabase |
| CP-016 | RF-015 | Cámara | Abrir panel y tomar foto | Cámara funciona y muestra imagen |
| CP-017 | RF-016 | GPS | Solicitar ubicación | Se obtienen coordenadas |

## Validaciones técnicas realizadas

- Los archivos JS/JSX del proyecto fueron parseados después de los cambios sin errores de sintaxis.
- Todos los imports relativos resuelven a archivos existentes.
- La función `create_donation()` fue ejecutada en una transacción de prueba con rol `authenticated` y luego revertida.
- Se comprobó que un usuario autenticado puede actualizar `full_name` pero no puede elevar su propio `role` a `admin`.
- Se comprobó en una transacción de prueba que una cuenta de Fundación asociada a `foundation_id = '1'` puede leer y actualizar sus necesidades.
