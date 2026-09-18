# Pilar de Sonrisas - Base V2

Esta versión reorganiza el MVP original para que el equipo pueda trabajar en paralelo sobre una estructura común.

## Cambios de la base

- La app abre directamente en Inicio; no exige login para explorar.
- Se incorpora un menú inferior propio con: Inicio, Fundaciones, Carrito, Donaciones y Cuenta.
- Los productos son generales. La fundación destinataria se asigna en el carrito.
- Se agrega `CartContext` para compartir el carrito entre pantallas.
- Se preparan pantallas de Cuenta, Registro, Historial y listado de Fundaciones.
- Login y Registro siguen simulados hasta conectar Supabase.
- Cámara y GPS del primer MVP se conservan en `FoundationPanelScreen.js`.

## Archivos centrales que NO deben modificarse sin coordinar con Nicolás

- `App.js`
- `src/context/CartContext.js`
- `src/constants/theme.js`
- `src/components/BottomNav.js`
- `src/data/products.js`
- `src/data/foundations.js`

## Reparto sugerido

- Micaela: Home + componentes visuales (`SearchBar`, `ProductCard`, `FoundationCard`).
- Juan: catálogo/búsqueda, filtros y detalle de producto.
- Joaquín: carrito, selector de fundación, checkout y confirmación.
- Facundo: Cuenta, Login, Registro, Panel Fundación, cámara/GPS.
- Nicolás: arquitectura, contexto global, integración, Figma y luego Supabase.

## Antes de crear una rama

```bash
git checkout main
git pull origin main
```

Luego crear la rama asignada para el sprint.
