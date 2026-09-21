# Arquitectura e integración

**Responsable:** Nicolás

## Estructura general

```text
src/
├── components/   Componentes reutilizables de interfaz
├── constants/    Tema y valores visuales comunes
├── context/      Estado global compartido
├── data/         Datos locales/mock
├── screens/      Pantallas de la aplicación
└── navigation/   Reservado para la organización de navegación si se separa de App.js
```

## Navegación

La aplicación utiliza una navegación principal con menú inferior para:

- Inicio
- Fundaciones
- Carrito
- Donaciones
- Cuenta

Además existen pantallas internas para detalle de producto, detalle de fundación, login, registro, checkout, confirmación y panel de fundación.

**Archivo principal:** `App.js`

[COMPLETAR SI CAMBIA LA IMPLEMENTACIÓN]

## CartContext

**Archivo:** `src/context/CartContext.js`

El contexto centraliza el estado del carrito para que distintas pantallas trabajen con la misma información.

### Operaciones disponibles

| Función | Qué hace |
|---|---|
| `addToCart(product)` | Agrega un producto al carrito. |
| `removeFromCart(productId)` | Elimina un producto. |
| `updateQuantity(productId, quantity)` | Cambia la cantidad de un producto. |
| `increaseQuantity(productId)` | Incrementa la cantidad. |
| `decreaseQuantity(productId)` | Disminuye la cantidad. |
| `assignFoundation(productId, foundationId)` | Asigna una fundación destinataria al producto. |
| `clearCart()` | Vacía el carrito. |

### Valores compartidos

- `cart`
- `totalItems`
- `totalPrice`
- `hasMissingFoundation`

[ACTUALIZAR SI EL CÓDIGO CAMBIA]

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
