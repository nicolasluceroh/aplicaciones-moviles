# Documentación técnica - Pilar de Sonrisas

Esta carpeta contiene la documentación técnica del proyecto. La idea es documentar lo que realmente existe en el código, de forma breve y directa.

## Reparto

- `00-proyecto.md` - Nicolás
- `01-requisitos.md` - Nicolás
- `02-home-ui.md` - Micaela
- `03-catalogo-productos.md` - Juan
- `04-carrito-donacion.md` - Joaquín
- `05-cuenta-fundacion.md` - Facundo
- `06-arquitectura-integracion.md` - Nicolás
- `07-base-de-datos.md` - Nicolás
- `08-pruebas.md` - todos aportan; Nicolás consolida
- `img/` - capturas de las pantallas

## Cómo documentar

Cada integrante completa solamente el archivo de su módulo. No hace falta explicar línea por línea ni copiar bloques grandes de código.

Para cada pantalla, componente o función importante indicar:

1. **Qué hace.** Una explicación de 1 a 3 frases.
2. **Archivo donde está.** Ejemplo: `src/screens/ProductScreen.js`.
3. **Funciones principales.** Nombre y una frase de qué hace cada una.
4. **Datos/estado que usa.** Ejemplo: `products`, `CartContext`, `navigation`.
5. **Navegación.** Desde dónde se llega y a dónde puede ir.
6. **Validaciones.** Solo las que realmente estén implementadas.
7. **Prueba manual.** Qué se probó en Expo Go y qué resultado se esperaba.
8. **Captura.** Guardar la imagen en `docs/img/` y referenciarla desde el `.md`.

## Ejemplo

```md
### ProductScreen.js

**Qué hace**

Muestra el detalle del producto seleccionado y permite agregarlo al carrito.

**Funciones principales**

| Función | Qué hace |
|---|---|
| `handleAddToCart()` | Agrega el producto actual al carrito global. |

**Prueba manual**

1. Abrir un producto desde el catálogo.
2. Presionar "Agregar al carrito".
3. Verificar que aparezca en Carrito.
```

## Regla importante

La documentación se actualiza en la misma rama donde se desarrolla la funcionalidad. Si se cambia código de un módulo, también se actualiza su archivo `.md` cuando corresponda.

No describir como terminada una funcionalidad que todavía no existe en el código.
