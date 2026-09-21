# Documentación técnica - Pilar de Sonrisas

La documentación del sprint debe ser corta y basada en el código real. No hace falta explicar cada línea ni copiar código completo.

## Formato para cada pantalla o componente

### Nombre
- Archivo:
- Responsable:
- Requisitos relacionados:

### Qué hace
Explicar en 2 o 3 frases para qué existe la pantalla/componente y qué puede hacer el usuario.

### Funciones principales
| Función | Qué hace | Datos que usa/cambia |
|---|---|---|
| `nombreFuncion()` | Descripción breve | Estado, contexto, parámetros, navegación, etc. |

### Estados y datos
- `estado`: para qué se usa.
- `otroEstado`: para qué se usa.
- Datos externos/locales usados: `products`, `foundations`, `CartContext`, etc.

### Navegación
- Llega desde:
- Puede ir a:
- Parámetros que recibe/envía:

### Validaciones
Anotar solamente las validaciones que existan realmente en el código.

### Prueba manual
1. Paso de prueba.
2. Acción.
3. Resultado esperado.

## Regla
Documentar funciones y comportamientos que existan en el código. Si una función todavía no está implementada, debe quedar como pendiente y no describirse como terminada.
