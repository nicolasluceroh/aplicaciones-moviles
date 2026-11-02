# Arquitectura e integración

**Responsable:** Nicolás

## Estructura general

```text
src/
├── components/   Componentes reutilizables de interfaz
├── config/       Configuración del cliente de Supabase
├── constants/    Tema y valores visuales comunes
├── context/      Estado global de autenticación y carrito
├── data/         Datos locales de fundaciones y muestras históricas (no catálogo público)
├── hooks/        Consultas compartidas del catálogo
├── utils/        Carga y eliminación de fotografías comerciales
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

Estas pantallas muestran el componente `BottomNav`. Además existen pantallas internas para catálogo, detalle de producto, detalle de fundación, login, registro, perfil, checkout, confirmación, detalle de donación, panel de fundación y gestión de necesidades y panel comercial.

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
- ofertas publicadas por comercios para necesidades pendientes;
- fotografías comerciales en Supabase Storage (`merchant-products`);
- perfiles comerciales y nombres públicos sincronizados con los productos;
- control de acceso mediante Row Level Security en tablas y objetos de Storage.

El checkout llama a la función `create_donation`, que registra la cabecera y los ítems de la donación dentro de una misma operación.

## Compatibilidad de ejecución

La rama de este PR actualiza el proyecto de **Expo SDK 57 a SDK 58** para probarlo con Expo Go en iOS. Se incluyen `expo-image-picker` y `@expo/vector-icons`, junto con las dependencias fijadas en `package.json` y `package-lock.json`. La versión efectiva se comprueba en esos archivos.

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

## Comercio y catálogo persistido

La pantalla `MerchantPanelScreen` valida el rol `merchant`, selecciona primero fundación y luego necesidad pendiente, y permite crear, **editar**, pausar, reactivar o eliminar ofertas propias asociadas a `foundation_needs`. `ProfileScreen` guarda `business_name` para comercios habilitados; los triggers de Supabase lo publican como `merchant_products.merchant_name`. `merchantImages.js` administra hasta tres fotografías por producto en Storage. Las políticas RLS restringen las modificaciones a cada propietario; el hook `useCatalogProducts` consulta exclusivamente ofertas comerciales activas, sin combinar el catálogo local de demostración. Ver `09-comercios.md`.
