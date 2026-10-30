# Carrito y donación

**Responsable:** Joaquín Pajon  
**Requisitos relacionados:** RF-004, RF-005, RF-009, RF-010

## Archivos principales

- `src/screens/ProductScreen.js`
- `src/screens/CartScreen.js`
- `src/screens/CheckoutScreen.js`
- `src/screens/ConfirmationScreen.js`
- `src/context/CartContext.js`
- `src/config/supabase.js`

## Qué hace el módulo

Implementa el flujo de donación desde la selección de productos hasta la confirmación. El usuario puede definir cantidades, asignar una fundación distinta a cada producto, revisar el resumen y confirmar una donación. Al confirmar, la donación y sus ítems se persisten en Supabase y luego quedan disponibles en `Mis donaciones`.

## Funciones principales

| Función | Archivo | Qué hace | Datos que usa/cambia |
|---|---|---|---|
| `addToCart(product, quantity)` | `CartContext.js` | Agrega un producto o suma la cantidad seleccionada si ya existe | `cart` |
| `increaseQuantity(productId)` | `CartContext.js` | Incrementa la cantidad de un producto | `cart` |
| `decreaseQuantity(productId)` | `CartContext.js` | Disminuye la cantidad sin bajar de 1 | `cart` |
| `removeFromCart(productId)` | `CartContext.js` | Elimina un producto del carrito | `cart` |
| `assignFoundation(productId, foundationId)` | `CartContext.js` | Asigna o cambia la fundación destinataria de un producto | `cart` |
| `clearCart()` | `CartContext.js` | Vacía el carrito después de una confirmación exitosa | `cart` |
| `handleConfirm()` | `CheckoutScreen.js` | Valida sesión/carrito y guarda la donación mediante `create_donation` | Supabase + `cart` |

## Selección de fundación

Cada producto del carrito puede tener una fundación destinataria diferente. `CartScreen` abre un selector modal y guarda la elección en `foundationId` mediante `assignFoundation`.

## Validaciones

- El carrito debe contener al menos un producto.
- Cada producto debe tener una fundación asignada antes de continuar.
- Para confirmar y guardar la donación el usuario debe iniciar sesión.
- Si Supabase devuelve un error, el carrito no se vacía y la app informa el problema.

## Checkout y confirmación

`CheckoutScreen` muestra los productos, cantidades, fundaciones destinatarias, subtotales, total y la leyenda de pago simulado. Al confirmar, llama a la función RPC `create_donation` de Supabase. Si el guardado finaliza correctamente, se vacía el carrito y se navega a `ConfirmationScreen` con el ID y total de la donación.

`ConfirmationScreen` muestra el mensaje de éxito, el total, un identificador corto de la donación y accesos para ir a `Mis donaciones` o volver al inicio.

## Prueba manual

1. Abrir un producto y seleccionar una cantidad mayor a 1.
2. Agregarlo al carrito y verificar que se conserve la cantidad elegida.
3. Agregar otro producto si se desea.
4. Cambiar cantidades con `+` y `-`.
5. Asignar una fundación a cada producto.
6. Verificar que no se pueda continuar mientras falte una fundación.
7. Continuar al checkout y revisar el resumen.
8. Confirmar la donación con una cuenta iniciada.
9. Verificar la pantalla de confirmación.
10. Abrir `Mis donaciones` y comprobar que la donación recién creada aparezca en el historial.

## Capturas

```md
![Carrito](./img/carrito.png)
![Checkout](./img/checkout.png)
![Confirmación](./img/confirmacion.png)
```
