# Proyecto - Pilar de Sonrisas

**Responsable de esta sección:** Nicolás

## Descripción

Pilar de Sonrisas es una aplicación móvil orientada a facilitar la donación de productos a fundaciones y organizaciones sociales. Las fundaciones publican necesidades; los comercios habilitados ofrecen productos asociados a esas necesidades, y los donantes pueden encontrarlos en el catálogo y agregarlos al carrito. La fundación destinataria queda definida por la necesidad que atiende cada publicación comercial.

La experiencia sigue una lógica de e-commerce: el catálogo puede explorarse sin iniciar sesión y la cuenta se solicita cuando es necesaria para registrar una donación y asociarla a un usuario. El pago se mantiene simulado dentro del alcance académico, mientras que la donación confirmada sí se persiste en Supabase.

## Objetivo

Facilitar el vínculo entre personas que quieren colaborar y las necesidades concretas de las fundaciones mediante una experiencia móvil simple, organizada y trazable.

## Alcance de la versión actual

- Inicio con productos y fundaciones.
- Catálogo, búsqueda y filtros de productos.
- Detalle de producto y selección de cantidad.
- Carrito compartido entre pantallas.
- Asignación automática de fundación destinataria desde la necesidad asociada a cada producto comercial.
- Checkout con pago simulado.
- Registro real de donaciones e ítems en Supabase.
- Registro, login, logout y persistencia de sesión.
- Edición de datos básicos del usuario.
- Historial y detalle de donaciones reales.
- Acceso diferenciado para cuentas de fundación.
- Gestión de necesidades de una fundación.
- Acceso para comercios habilitados y publicación de productos vinculados a necesidades pendientes.
- Edición, pausa, reactivación y eliminación de publicaciones propias.
- Selección de fundación y necesidad mediante desplegables dependientes.
- Carga de hasta tres fotografías por producto en Supabase Storage.
- Edición del nombre comercial y visualización pública del comercio vendedor en la ficha del producto.
- Catálogo público con productos comerciales (las necesidades no son productos del catálogo).
- Cámara y geolocalización en el panel de fundación.

## Tecnologías

- Expo SDK 58 (rama de este PR; proyecto original en SDK 57)
- Expo Image Picker
- React Native
- JavaScript
- React Navigation
- Supabase Auth, PostgreSQL y Storage
- Expo Camera
- Expo Location
- Git / GitHub
- Trello
- Figma

## Organización del trabajo

El equipo trabaja mediante ramas de Git por funcionalidad y Pull Requests hacia `main`. Trello se utiliza para reflejar el estado de las tareas y la documentación técnica se mantiene dentro de `docs/`.
