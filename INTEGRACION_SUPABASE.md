# Integración Supabase - prueba local

La primera etapa de Supabase ya está conectada en el código: registro, login, logout, sesión persistente y perfiles.

## 1. Dependencias

Desde la raíz del proyecto ejecutar:

```powershell
npm.cmd install
```

Si npm no agrega las dependencias nuevas por algún motivo, ejecutar:

```powershell
npm.cmd install @supabase/supabase-js react-native-url-polyfill
npx.cmd expo install @react-native-async-storage/async-storage
```

## 2. Variables de entorno

El archivo `.env` local contiene la URL y la clave publishable del proyecto usado para las pruebas. Está ignorado por Git.

Para otra máquina, copiar `.env.example` como `.env` y completar:

```text
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Nunca usar una secret key ni `service_role` dentro de Expo.

## 3. Ejecutar

```powershell
npx.cmd expo start -c
```

## 4. Prueba recomendada

1. Cuenta -> Crear cuenta.
2. Completar nombre, email y contraseña.
3. Verificar que el usuario aparezca en Supabase Authentication.
4. Verificar la fila correspondiente en Table Editor -> `profiles`.
5. Cerrar sesión.
6. Iniciar sesión con el mismo usuario.
7. Cerrar Expo Go y volver a abrirlo; la sesión debe recuperarse.
8. Cerrar sesión nuevamente.

## Confirmación de email

Supabase puede exigir confirmación por email según la configuración del proveedor Email. El código soporta ambos casos:

- si Supabase crea una sesión inmediatamente, la app entra a Cuenta;
- si exige confirmación, la app avisa que hay que confirmar el correo y luego iniciar sesión.

Para una prueba académica rápida se puede desactivar temporalmente la confirmación de email desde Authentication -> Providers -> Email en el dashboard de Supabase.

## Fundación

El login de fundación ya valida roles, pero no existe registro público de fundaciones. Para probarlo hay que crear una cuenta y asignarle `role = 'foundation'` en `public.profiles`.
