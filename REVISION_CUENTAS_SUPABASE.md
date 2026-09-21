# Revisión de cuentas y Supabase

## Qué se corrigió

- Registro real con Supabase Auth y confirmación por email.
- Reenvío del correo de confirmación desde Registro y Login.
- Login con mensajes claros para email sin confirmar y credenciales inválidas.
- Validación de sesión al iniciar la app para limpiar sesiones locales de usuarios borrados en Supabase.
- Pantalla Mis datos funcional: nombre, email y cambio opcional de contraseña.
- Historial de donaciones real: ya no usa datos simulados.
- Checkout guarda la donación en Supabase antes de mostrar Confirmación.
- Detalle de donación real.
- Confirmación enlaza con Mis donaciones.
- La cuenta es obligatoria solo al confirmar el checkout, no para explorar ni armar carrito.
- RLS para que cada donante vea únicamente sus propias donaciones.
- Se bloqueó la posibilidad de que un usuario común se cambie a role=foundation/admin.
- Panel Fundación usa métricas y necesidades reales de Supabase.
- Gestión básica de necesidades para cuentas de Fundación.

## Estado actual de la cuenta de prueba

Al momento de esta revisión Supabase tenía una cuenta activa sin confirmar. Esa cuenta no puede iniciar sesión hasta confirmar el correo. La app ahora lo detecta y permite reenviar el email de confirmación desde Login.

## Flujo de prueba recomendado

1. Abrir Cuenta.
2. Crear una cuenta con un email de prueba.
3. Confirmar el email recibido.
4. Iniciar sesión.
5. Entrar a Mis datos, cambiar el nombre y guardar.
6. Ir a Home, agregar un producto, elegir fundación y continuar.
7. Confirmar la donación en Checkout.
8. Desde Confirmación entrar a Mis donaciones.
9. Verificar que aparece solo la donación recién creada.
10. Abrir el detalle de la donación y revisar productos, cantidades, precios y fundación.
11. Cerrar sesión y comprobar que Mis donaciones pide iniciar sesión.
12. Volver a iniciar sesión y comprobar que el historial persiste.
13. Cerrar Expo Go por completo y abrirlo otra vez: la sesión debe persistir.

## Cuenta de Fundación

Una cuenta normal se crea como `donor`. Para una cuenta de prueba de Fundación debe existir un usuario confirmado y luego un administrador debe asignar en `profiles`:

- `role = 'foundation'`
- `foundation_id = '1'`

El usuario común no puede modificar esos campos desde la app.
