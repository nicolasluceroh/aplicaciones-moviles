
El estado del carrito es **global y compartido** entre pantallas mediante `CartContext` (archivo `src/context/EstadoCarrito.js`), permitiendo que cada producto agregado tenga su propia fundación destinataria, cantidad independiente, y que el resumen final sea consistente en todas las pantallas.

---

## 2. Archivos del módulo

| Archivo | Responsabilidad |
|---|---|
| `src/context/EstadoCarrito.js` | Estado global del carrito: productos, cantidades, fundaciones, totales y última orden confirmada |
| `src/screens/CartScreen.js` | Vista y edición del carrito (cantidad, fundación, eliminar) |
| `src/screens/CheckoutScreen.js` | Resumen previo a confirmar la donación (pago simulado) |
| `src/screens/ConfirmationScreen.js` | Confirmación final agrupada por fundación beneficiada |
| `src/screens/ProductScreen.js` | *(fuera de este módulo, pero integrado)* botón "Donar este producto" conectado a `addToCart` |

---

## 3. Estado global — `CartContext`

### Estructura de un producto en el carrito

```javascript
{
  id: string,
  name: string,
  price: number,
  quantity: number,
  foundationId: string | null,
}
```

### Estados expuestos

| Estado | Descripción |
|---|---|
| `cart` | Array de productos actualmente en el carrito |
| `totalItems` | Suma de cantidades de todos los productos |
| `totalPrice` | Monto total acumulado |
| `hasMissingFoundation` | `true` si algún producto no tiene fundación asignada |
| `lastOrder` | Snapshot de la última donación confirmada (`items`, `totalItems`, `totalPrice`, `confirmedAt`), persiste aunque `cart` se vacíe |

### Funciones principales

| Función | Uso |
|---|---|
| `addToCart(product, quantity)` | Agrega un producto nuevo o suma cantidad si ya existe |
| `increaseQuantity(productId)` | Incrementa cantidad de un producto |
| `decreaseQuantity(productId)` | Decrementa cantidad; si llega a 0, elimina el producto |
| `removeFromCart(productId)` | Elimina un producto del carrito |
| `assignFoundation(productId, foundationId)` | Asigna/cambia la fundación destinataria de un producto puntual |
| `confirmOrder()` | Genera el snapshot en `lastOrder` y vacía `cart` (usado al confirmar la donación) |
| `clearCart()` | Vacía el carrito sin generar snapshot |

---

## 4. Flujo de pantallas

### `ProductScreen` (integración)
El botón "Donar este producto" llama a `addToCart(product)` y navega a `Cart` sin pasar parámetros, ya que el carrito se lee íntegramente desde el contexto.

### `CartScreen`
- Lista todos los productos del carrito con cantidad, subtotal y fundación seleccionada.
- Permite incrementar/decrementar cantidad, eliminar productos y asignar fundación individual por producto mediante un selector modal.
- **Regla de bloqueo:** si `hasMissingFoundation` es `true`, se muestra una advertencia y el botón "Continuar al checkout" queda deshabilitado.
- Si el carrito está vacío, muestra una vista alternativa con acceso a "Ver productos".

### `CheckoutScreen`
- Muestra el resumen completo: cada producto con su fundación asignada, cantidad y subtotal.
- Indica el método de pago como **"Pago simulado"** (sin integración real).
- Al confirmar, simula un procesamiento (~1.2s con `ActivityIndicator`), llama a `confirmOrder()` y navega a `Confirmation`.

### `ConfirmationScreen`
- Lee `lastOrder` del contexto (no `cart`, que ya está vacío en este punto).
- Agrupa los montos donados **por fundación** (si dos productos van a la misma fundación, se suman en una sola fila).
- Muestra: "¡Gracias por tu donación!", estado "Donación confirmada", detalle por fundación y total.
- Botón "Volver al inicio" navega a `Home`.
- Si no hay `lastOrder` (acceso directo sin pasar por checkout), muestra un mensaje alternativo en vez de romper.

---

## 5. Pasos de prueba manual

1. **Agregar productos:** entrar a 2 productos distintos desde `ProductScreen` y donarlos. Verificar que ambos aparecen en `CartScreen`.
2. **Edición de cantidad:** usar `+`/`−` en un producto y confirmar que el subtotal y el total general se recalculan.
3. **Bloqueo por fundación faltante:** sin asignar fundación a ningún producto, confirmar que aparece el aviso y el botón "Continuar" está deshabilitado.
4. **Asignación de fundación por producto:** asignar fundaciones distintas a cada producto y confirmar que no se pisan entre sí.
5. **Eliminar producto:** quitar un producto y verificar que desaparece de la lista y el total se ajusta.
6. **Checkout:** confirmar que el resumen coincide exactamente con lo visto en el carrito (productos, fundaciones, total).
7. **Confirmar donación:** verificar el estado de carga (~1.2s) y que no se puede tocar el botón dos veces.
8. **Confirmación agrupada:** si dos productos comparten fundación, verificar que se muestran sumados en una sola fila y no duplicados.
9. **Volver al inicio:** confirmar navegación a `Home` y que el carrito queda vacío tras la donación.
10. **Caso borde:** intentar entrar a `Confirmation` sin pasar por checkout y verificar el mensaje "No hay donaciones recientes" en vez de un crash.

---

## 6. Notas técnicas

- El pago es **completamente simulado**: no hay integración con ninguna pasarela real ni backend de pagos.
- El `CartProvider` envuelve el `NavigationContainer` en `App.js`, permitiendo que todas las pantallas de la app accedan al carrito mediante `useCart()`.
- Los totales (`totalItems`, `totalPrice`, `hasMissingFoundation`) se calculan con `useMemo` dentro del contexto para evitar recálculos innecesarios.
