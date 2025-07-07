
# Base de Datos SQLite - Sistema TAKAB

## Descripción
Este sistema utiliza SQLite como base de datos local para el inventario de la empresa TAKAB. SQLite es ideal para aplicaciones empresariales locales ya que:

- No requiere servidor de base de datos separado
- Funciona perfectamente en Raspberry Pi
- Es confiable y rápida para aplicaciones de tamaño medio
- Fácil de respaldar (un solo archivo)
- Soporte completo para transacciones ACID

## Estructura de la Base de Datos

### Tablas Principales

1. **usuarios** - Gestión de usuarios del sistema
2. **productos** - Catálogo de productos y herramientas
3. **categorias** - Clasificación de productos
4. **proveedores** - Información de proveedores
5. **clientes** - Datos de clientes (opcional)
6. **almacenes** - Ubicaciones de almacenamiento
7. **movimientos_inventario** - Historial de entradas/salidas
8. **solicitudes_materiales** - Solicitudes de empleados
9. **items_solicitudes** - Detalles de solicitudes
10. **prestamos_herramientas** - Control de préstamos
11. **ordenes_compra** - Órdenes de compra
12. **logs_actividad** - Auditoría del sistema

### Características Implementadas

- **Integridad referencial** con claves foráneas
- **Validación de datos** con constraints CHECK
- **Índices optimizados** para consultas frecuentes
- **Triggers automáticos** para timestamps
- **Datos iniciales** para configuración básica
- **Logs de auditoría** para seguimiento de cambios

## Instalación y Configuración

### Para Desarrollo (Frontend React)
```bash
# Instalar dependencias de SQLite para desarrollo
npm install better-sqlite3
npm install @types/better-sqlite3 --save-dev
```

### Para Producción (Servidor)
El archivo de base de datos SQLite se creará automáticamente en:
```
/data/takab_inventory.db
```

### Inicialización
1. Ejecutar el script `sqlite-schema.sql` para crear la estructura
2. Los datos iniciales se insertan automáticamente
3. Usuario por defecto: admin/admin123

## Usuarios Predeterminados

| Usuario | Contraseña | Rol | Email |
|---------|------------|-----|-------|
| admin | admin123 | admin | admin@takab.com |
| almacen | almacen123 | almacen | almacen@takab.com |
| empleado | empleado123 | empleado | juan.perez@takab.com |

## Respaldo y Mantenimiento

### Respaldo Automático
```sql
-- Crear respaldo de la base de datos
.backup /backups/takab_backup_YYYYMMDD.db
```

### Mantenimiento
```sql
-- Optimizar base de datos
VACUUM;

-- Analizar estadísticas
ANALYZE;

-- Verificar integridad
PRAGMA integrity_check;
```

## Consultas Útiles

### Productos con Stock Bajo
```sql
SELECT nombre, stock_actual, stock_minimo 
FROM productos 
WHERE stock_actual <= stock_minimo;
```

### Herramientas Prestadas
```sql
SELECT p.nombre, u.name as empleado, ph.fecha_prestamo
FROM prestamos_herramientas ph 
JOIN productos p ON ph.producto_id = p.id
JOIN usuarios u ON ph.empleado_id = u.id
WHERE ph.estado = 'prestado';
```

### Solicitudes Pendientes
```sql
SELECT sm.id, u.name as empleado, sm.proyecto, sm.fecha_solicitud
FROM solicitudes_materiales sm
JOIN usuarios u ON sm.empleado_id = u.id
WHERE sm.estado = 'pendiente';
```

## Seguridad

- Las contraseñas se almacenan con hash bcrypt
- Logs de auditoría para todas las operaciones críticas
- Validación de roles a nivel de base de datos
- Respaldos automáticos programados

## Escalabilidad

El sistema está diseñado para manejar:
- Hasta 10,000 productos
- 50 usuarios concurrentes
- 100,000 movimientos de inventario anuales
- Excelente rendimiento en Raspberry Pi 4

Para empresas más grandes, se puede migrar fácilmente a PostgreSQL o MySQL manteniendo la misma estructura.
