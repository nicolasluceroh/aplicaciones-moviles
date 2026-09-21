# Cómo agregar esta estructura al repositorio

1. Copiar la carpeta `docs/` completa a la raíz del repositorio.
2. Reemplazar `TRELLO_SPRINT_V2.md` por la versión incluida en este paquete si el archivo ya existe.
3. No borrar los archivos del proyecto ni mover `src/`.
4. Hacer estos cambios en una rama propia, no directamente en `main`.

Ejemplo:

```bash
git checkout main
git pull origin main
git checkout -b chore/docs-sprint-v2
```

Después de copiar:

```bash
git add docs TRELLO_SPRINT_V2.md
git commit -m "docs: agregar estructura de documentacion del sprint 2"
git push -u origin chore/docs-sprint-v2
```

Crear un Pull Request hacia `main` y, una vez integrado, todo el equipo debe actualizar su `main` antes de crear las ramas del sprint.
