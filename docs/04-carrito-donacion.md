# Carrito y donación

**Responsable:** Joaquín Pajon
**Requisitos relacionados:** RF-004, RF-005, RF-009

## Archivos principales

- `src/screens/CartScreen.js`
- `src/screens/CheckoutScreen.js`
- `src/screens/ConfirmationScreen.js`
- `src/screens/ProductScreen.js` *(fuera de este módulo, pero se ajustó el botón "Donar este producto" para conectarlo con el carrito)*
- Contexto utilizado: `src/context/EstadoCarrito.js`

## Qué hace el módulo

Implementa el flujo completo de donación de la app: desde que el usuario agrega un producto, pasando por la selección de una fundación destinataria por cada producto, hasta el checkout (pago simulado) y la pantalla de confirmación con el detalle de fundaciones beneficiadas.

## Funciones principales

| Función | Archivo | Qué hace | Datos que usa/cambia |
|---|---|---|---|
| `addToCart(product, quantity)` | `EstadoCarrito.js` | Agrega un producto nuevo o suma cantidad si ya existe | `cart` |
| `increaseQuantity(productId)` | `EstadoCarrito.js` | Incrementa cantidad de un producto | `cart` |
| `decreaseQuantity(productId)` | `EstadoCarrito.js` | Decrementa cantidad; si llega a 0, elimina el producto | `cart` |
| `removeFromCart(productId)` | `EstadoCarrito.js` | Elimina un producto del carrito | `cart` |
| `assignFoundation(productId, foundationId)` | `EstadoCarrito.js` | Asigna/cambia la fundación destinataria de un producto puntual | `cart` |
| `confirmOrder()` | `EstadoCarrito.js` | Genera un snapshot en `lastOrder` y vacía `cart` | `cart`, `lastOrder` |

## Selección de fundación

Cada producto del carrito permite elegir su propia fundación destinataria de forma independiente, mediante un selector modal en `CartScreen`. Dos productos distintos pueden donarse a fundaciones diferentes dentro de la misma compra. La asignación se guarda en el campo `foundationId` de cada ítem del carrito.

## Validaciones

- Si algún producto del carrito no tiene fundación asignada (`hasMissingFoundation === true`), se muestra una advertencia y se bloquea el botón "Continuar al checkout".

## Checkout y confirmación

En `CheckoutScreen` se muestra el resumen completo: cada producto con su fundación asignada, cantidad, subtotal y el total general, junto con la leyenda "Pago simulado". Al confirmar, se simula un procesamiento breve y se llama a `confirmOrder()`, que genera un snapshot (`lastOrder`) y vacía el carrito.

En `ConfirmationScreen` se lee ese `lastOrder` (no el carrito, que ya está vacío) y se muestra el mensaje "¡Gracias por tu donación!", el estado "Donación confirmada", el detalle agrupado por fundación beneficiada y el total. El botón "Volver al inicio" navega a `Home`.

## Prueba manual

1. Agregar dos productos al carrito desde `ProductScreen`.
2. Cambiar cantidades con los controles `+`/`−`.
3. Seleccionar una fundación distinta para cada producto.
4. Continuar al checkout y verificar que el resumen coincide con el carrito.
5. Confirmar la donación.
6. Resultado esperado: se navega a `ConfirmationScreen`, se muestra el detalle agrupado por fundación con los montos correctos, el total coincide, y el carrito queda vacío al volver a entrar.

## Capturas

```md
![Carrito](./img/carrito.png)
![Checkout](./img/checkout.png)
![Confirmación](./img/confirmacion.png)
```