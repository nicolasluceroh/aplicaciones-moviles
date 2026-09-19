# Trello - Sprint V2

Este archivo resume cómo usar el tablero. Trello representa el estado del trabajo; la documentación técnica se guarda en `docs/` dentro del repositorio.

## Listas del tablero

1. **Backlog** - ideas o tareas que no se trabajarán todavía.
2. **Por hacer** - tareas comprometidas para el sprint actual y todavía no iniciadas.
3. **En desarrollo** - tareas que alguien está trabajando en este momento.
4. **En revisión / PR** - código terminado y Pull Request creado.
5. **Testing** - cambios ya integrados que se están probando en `main`.
6. **Hecho** - funcionalidad integrada, probada y documentada cuando corresponde.

## Movimiento de una tarjeta

```text
Por hacer
  -> En desarrollo
  -> En revisión / PR
  -> Testing
  -> Hecho
```

Si falla en Testing, vuelve a **En desarrollo**.

## Qué debe tener una tarjeta de desarrollo

- Título concreto.
- Responsable.
- Etiqueta (Frontend, UX/UI, Integración, Autenticación, Hardware, Base de datos, Testing, Documentación).
- Descripción de qué debe quedar funcionando.
- Rama de Git.
- Requisitos relacionados (RF) si corresponde.
- Checklist de funcionalidad cuando sea útil.
- Checklist `Para finalizar`.
- Link al Pull Request cuando exista.

## Checklist estándar - Para finalizar

Usar este checklist en las tarjetas nuevas que impliquen desarrollo o modificación de código:

- [ ] Funcionalidad implementada.
- [ ] Probada en Expo Go.
- [ ] Sin errores que impidan utilizarla.
- [ ] Respeta la estructura/diseño definido.
- [ ] Documentación del módulo actualizada en `docs/` si corresponde.
- [ ] Captura agregada en `docs/img/` si corresponde.
- [ ] Commits realizados.
- [ ] Pull Request creado.
- [ ] Probada nuevamente en `main` después del merge.

## Documentación y Trello

No existe una lista llamada "Documentación". Documentar forma parte de terminar una tarea de desarrollo.

Ejemplo: la tarjeta `Implementar búsqueda de productos` no se considera terminada hasta que Juan actualiza `docs/03-catalogo-productos.md` con la función que implementó, cuando esa modificación necesita explicación.

La única tarjeta específica de documentación recomendada es `Consolidar documentación técnica`, a cargo de Nicolás, para revisar y unificar todo al final.

## Trabajo anterior

Las tareas reales del MVP anterior y de la Base V2 pueden permanecer en **Hecho**. No es necesario agregarles checklists retroactivos. Cuando exista un PR asociado, conviene pegar su enlace como evidencia.

## Ramas del sprint

- Micaela: `feature/mica-home-ui`
- Juan: `feature/juan-catalog-search`
- Joaquín: `feature/joaquin-cart-donation`
- Facundo: `feature/facundo-auth-account`
- Nicolás: ramas específicas para integración/backend según necesidad.
