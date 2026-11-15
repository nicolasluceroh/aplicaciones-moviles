# Objetos PostgreSQL aplicados al proyecto

**Responsable:** Nicolás  
**Unidad relacionada:** vistas, funciones, procedimientos almacenados, triggers y transacciones

Este documento identifica los objetos PostgreSQL utilizados por Pilar de Sonrisas y su relación con reglas reales del dominio.

## 1. Vista: `v_catalogo_productos_disponibles`

La vista evita repetir en la aplicación el `JOIN` entre `merchant_products` y `foundation_needs`. Solo expone publicaciones activas que tengan stock y cuya necesidad todavía posea unidades pendientes.

```sql
select *
from public.v_catalogo_productos_disponibles
order by created_at desc;
```

La vista usa `security_invoker = true` para respetar las políticas RLS de las tablas subyacentes.

## 2. Función: `create_donation(jsonb)`

Es una función PL/pgSQL que devuelve el UUID de la donación creada. Implementa una operación transaccional completa:

1. valida usuario e ítems;
2. bloquea productos y necesidades con `FOR UPDATE`;
3. valida publicación activa, stock y unidades pendientes;
4. toma el precio vigente desde la base;
5. crea `donations` y `donation_items`;
6. descuenta stock y necesidad;
7. devuelve el UUID de la donación.

Si alguna validación falla, se lanza `RAISE EXCEPTION` y la sentencia completa se revierte.

## 3. Procedimiento: `sp_cerrar_necesidad(uuid)`

Se invoca con `CALL` y no devuelve un valor. Su objetivo es ejecutar una acción administrativa coherente sobre más de una tabla.

```sql
begin;
call public.sp_cerrar_necesidad('UUID_DE_NECESIDAD');
-- comprobaciones
rollback;
```

El procedimiento usa `PERFORM`, `FOUND`, `RAISE EXCEPTION` y `FOR UPDATE`. Si la necesidad existe y está abierta, establece `pending = 0` y desactiva las publicaciones relacionadas.

## 4. Trigger: `trg_auditar_necesidad`

Se ejecuta automáticamente después de un cambio real en `foundation_needs.pending`:

```text
UPDATE foundation_needs.pending
        ↓
trg_auditar_necesidad
        ↓
app_private.audit_foundation_need_pending()
        ↓
auditoria_necesidades
```

La condición `OLD.pending IS DISTINCT FROM NEW.pending` evita registrar actualizaciones que no cambian el valor.

## 5. Auditoría

`auditoria_necesidades` almacena:

- necesidad modificada;
- cantidad anterior;
- cantidad nueva;
- fecha del cambio;
- usuario autenticado cuando existe contexto de Auth.

La tabla tiene RLS habilitado y no se expone al cliente móvil.

## 6. Prueba de atomicidad

La prueba académica recomendada se ejecuta dentro de una transacción:

```sql
begin;

call public.sp_cerrar_necesidad('UUID_DE_NECESIDAD');

select * from public.foundation_needs where id = 'UUID_DE_NECESIDAD';
select * from public.auditoria_necesidades where need_id = 'UUID_DE_NECESIDAD';

rollback;
```

Antes del `ROLLBACK` deben observarse el cambio y su auditoría. Después del `ROLLBACK`, ambos deben desaparecer/revertirse. Esto demuestra que la modificación y el registro automático participan de la misma transacción.

## 7. Integridad del inventario

Se distinguen dos cantidades:

- `merchant_products.stock`: unidades que el comercio tiene disponibles;
- `foundation_needs.pending`: unidades que la fundación todavía necesita.

Una compra solo puede confirmar una cantidad menor o igual a ambas. La interfaz ayuda a limitarla, pero PostgreSQL realiza la validación definitiva para protegerse frente a datos desactualizados o compras concurrentes.
