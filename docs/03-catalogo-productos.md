# Catálogo y productos

**Responsable:** Juan  
**Requisitos relacionados:** RF-001, RF-002, RF-003, RF-004

## Archivos principales

- `src/screens/CatalogScreen.js`
- `src/screens/ProductScreen.js`
- Componentes reutilizados: Tarjetas de productos, barra de búsqueda y botones de navegación.

## Qué hace el módulo

Permite visualizar **únicamente** productos activos publicados por comercios para necesidades de fundaciones aún pendientes, con foto, categoría, título y precio. La ficha muestra también el nombre público del comercio ("Vendido por: ..."), la descripción y la cantidad seleccionada. Las necesidades de las fundaciones se consultan en la ficha de cada fundación, no en el catálogo.

## Funciones principales

| Función | Archivo | Qué hace | Datos que usa/cambia |
|---|---|---|---|
| Renderizado del listado | `CatalogScreen.js` | Muestra las tarjetas con los productos disponibles | Lee el listado general de productos |
| Selección de producto | `CatalogScreen.js` | Navega a la vista de detalle al hacer clic en un producto | Pasa el ID o los datos del producto seleccionado |
| Ajuste de cantidad | `ProductScreen.js` | Incrementa o decrementa las unidades a donar | Modifica el estado local de cantidad |

## Búsqueda y filtros

El módulo cuenta con una barra de búsqueda superior que permite filtrar los productos en tiempo real ingresando palabras clave relacionadas con el título o la categoría.

## Integración con el carrito

Permite enviar al `CartContext` el producto y la cantidad elegida. En las publicaciones comerciales, el destino se obtiene de `foundation_needs` mediante `merchant_products.need_id`; no se permite reasignarlo arbitrariamente a otra fundación desde el carrito.

## Navegación

- Se llega desde: Pantalla de inicio (Home) o solapa de navegación inferior.
- Puede navegar a: Pantalla de detalle de producto (`ProductScreen.js`).
- Parámetros recibidos/enviados: Identificador del producto seleccionado para mostrar su información específica.

## Prueba manual

1. Publicar una necesidad desde una cuenta de fundación y confirmar que no aparece como producto en el catálogo.
2. Publicar desde una cuenta comercial un producto asociado a esa necesidad, con imágenes.
3. Abrir el catálogo, buscar el producto publicado y abrir su detalle.
4. Verificar fotos, precio y texto «Vendido por: ...», ajustar la cantidad y agregarlo al carrito.
5. Resultado esperado: el producto aparece en el carrito con la fundación de la necesidad asignada automáticamente.

## Capturas

![Catálogo](./img/catalogo.png)
![Detalle de producto](./img/producto.png)
## Integración de ofertas de comercios

`src/hooks/useCatalogProducts.js` consulta `merchant_products` y expone **solo** las ofertas activas vinculadas a necesidades con unidades pendientes; **no** mezcla los datos locales de `src/data/products.js`. Las ofertas persistidas tienen ID `merchant:<uuid>`, fotografías en Supabase Storage, `merchant_name` público y `foundationId` fijado por su necesidad. El detalle y el carrito mantienen esa asociación. Ver `09-comercios.md`.
