# Arquitectura e integración

**Responsable:** Nicolás

## Estructura general

```text
src/
├── components/   Componentes reutilizables de interfaz
├── config/       Configuración del cliente de Supabase
├── constants/    Tema y valores visuales comunes
├── context/      Estado global de autenticación y carrito
├── data/         Datos locales del catálogo y fundaciones
└── screens/      Pantallas de la aplicación

supabase/
└── migrations/   Definición y cambios de la base de datos
```

## Navegación

La navegación se define en `App.js` mediante React Navigation y un `NativeStackNavigator`.

Las secciones principales son:

- Inicio
- Fundaciones
- Carrito
- Mis donaciones
- Cuenta

Estas pantallas muestran el componente `BottomNav`. Además existen pantallas internas para catálogo, detalle de producto, detalle de fundación, login, registro, perfil, checkout, confirmación, detalle de donación, panel de fundación y gestión de necesidades.

## Contextos globales

`App.js` envuelve la navegación con dos proveedores:

1. `AuthProvider`, que mantiene sesión y perfil de Supabase.
2. `CartProvider`, que mantiene el carrito durante el uso de la aplicación.

### AuthContext

**Archivo:** `src/context/AuthContext.js`

Responsabilidades principales:

- recuperar y validar la sesión persistida;
- escuchar cambios de autenticación;
- cargar el perfil asociado al usuario;
- exponer usuario, sesión, perfil y estado de carga;
- cerrar sesión y refrescar datos del perfil.

### CartContext

**Archivo:** `src/context/CartContext.js`

El contexto centraliza el estado del carrito para que Producto, Carrito y Checkout trabajen con la misma información.

| Función | Qué hace |
|---|---|
| `addToCart(product, quantity)` | Agrega un producto o suma la cantidad indicada. |
| `removeFromCart(productId)` | Elimina un producto. |
| `updateQuantity(productId, quantity)` | Cambia la cantidad de un producto. |
| `increaseQuantity(productId)` | Incrementa la cantidad. |
| `decreaseQuantity(productId)` | Disminuye la cantidad sin bajar de 1. |
| `assignFoundation(productId, foundationId)` | Asigna la fundación destinataria del producto. |
| `clearCart()` | Vacía el carrito. |

Valores compartidos:

- `cart`
- `totalItems`
- `totalPrice`
- `hasMissingFoundation`

## Integración con Supabase

**Cliente:** `src/config/supabase.js`

La app utiliza Supabase para:

- autenticación por email y contraseña;
- persistencia de sesión mediante AsyncStorage;
- perfiles de usuario;
- donaciones e ítems de donación;
- historial del donante;
- necesidades de las fundaciones;
- control de acceso mediante Row Level Security.

El checkout llama a la función `create_donation`, que registra la cabecera y los ítems de la donación dentro de una misma operación.

## Integración por módulos

- Home y UI: Micaela
- Catálogo y productos: Juan
- Carrito y donación: Joaquín
- Cuenta y fundación: Facundo
- Navegación, contexto, integración y backend: Nicolás

## Criterio de integración

1. Cada integrante trabaja en su rama.
2. Se crea un Pull Request hacia `main`.
3. Se revisa el código y se prueba la funcionalidad.
4. Se realiza el merge.
5. Se vuelve a probar desde `main` antes de mover la tarjeta de Trello a `Hecho`.
