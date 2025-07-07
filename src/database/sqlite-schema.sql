
-- TAKAB Inventory System - SQLite Database Schema
-- Base de datos local para sistema de inventario empresarial

-- Tabla de usuarios del sistema
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Hash de la contraseña
    name TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'almacen', 'empleado')) NOT NULL DEFAULT 'empleado',
    active BOOLEAN DEFAULT 1,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías de productos
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL,
    descripcion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    contacto TEXT,
    telefono TEXT,
    email TEXT,
    direccion TEXT,
    condiciones_pago TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    contacto TEXT,
    telefono TEXT,
    email TEXT,
    direccion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de almacenes
CREATE TABLE IF NOT EXISTS almacenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    ubicacion TEXT,
    responsable TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de unidades de medida
CREATE TABLE IF NOT EXISTS unidades_medida (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL,
    abreviacion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de productos
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    proveedor_id INTEGER REFERENCES proveedores(id),
    categoria_id INTEGER REFERENCES categorias(id),
    peso REAL,
    anchura REAL,
    profundidad REAL,
    alto REAL,
    unidad_medida TEXT,
    marca TEXT,
    color TEXT,
    especificaciones TEXT,
    origen TEXT,
    costo_compra REAL,
    precio_venta REAL,
    stock_minimo INTEGER NOT NULL DEFAULT 0,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    ubicacion TEXT CHECK(ubicacion IN ('Almacén 1', 'Almacén 2')) DEFAULT 'Almacén 1',
    estado TEXT CHECK(estado IN ('Nuevo', 'Usado', 'Dañado', 'En reparación')) DEFAULT 'Nuevo',
    es_herramienta BOOLEAN DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de movimientos de inventario (entradas, salidas, transferencias)
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    tipo TEXT CHECK(tipo IN ('entrada', 'salida', 'transferencia', 'ajuste')) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL,
    almacen_origen TEXT,
    almacen_destino TEXT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    proveedor_id INTEGER REFERENCES proveedores(id),
    cliente_id INTEGER REFERENCES clientes(id),
    numero_factura TEXT,
    observaciones TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de solicitudes de material de empleados
CREATE TABLE IF NOT EXISTS solicitudes_materiales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER NOT NULL REFERENCES usuarios(id),
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado TEXT CHECK(estado IN ('pendiente', 'aprobado', 'entregado', 'devuelto', 'rechazado')) DEFAULT 'pendiente',
    comentario TEXT,
    proyecto TEXT,
    aprobado_por INTEGER REFERENCES usuarios(id),
    fecha_aprobacion DATETIME,
    fecha_entrega DATETIME,
    fecha_devolucion DATETIME,
    observaciones_aprobacion TEXT,
    observaciones_entrega TEXT
);

-- Tabla de items de solicitudes de material
CREATE TABLE IF NOT EXISTS items_solicitudes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solicitud_id INTEGER NOT NULL REFERENCES solicitudes_materiales(id),
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    es_consumible BOOLEAN DEFAULT 1,
    cantidad_entregada INTEGER DEFAULT 0,
    cantidad_devuelta INTEGER DEFAULT 0,
    estado_devolucion TEXT CHECK(estado_devolucion IN ('Bueno', 'Dañado', 'Perdido')),
    observaciones TEXT
);

-- Tabla de préstamos de herramientas
CREATE TABLE IF NOT EXISTS prestamos_herramientas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    empleado_id INTEGER NOT NULL REFERENCES usuarios(id),
    responsable_prestamo INTEGER NOT NULL REFERENCES usuarios(id),
    fecha_prestamo DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_estimada_devolucion DATE,
    fecha_devolucion DATETIME,
    estado TEXT CHECK(estado IN ('prestado', 'devuelto', 'perdido', 'dañado')) DEFAULT 'prestado',
    observaciones_prestamo TEXT,
    observaciones_devolucion TEXT,
    estado_al_devolver TEXT CHECK(estado_al_devolver IN ('Bueno', 'Dañado', 'Perdido'))
);

-- Tabla de órdenes de compra
CREATE TABLE IF NOT EXISTS ordenes_compra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proveedor_id INTEGER NOT NULL REFERENCES proveedores(id),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    fecha_orden DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_estimada_entrega DATE,
    estado TEXT CHECK(estado IN ('pendiente', 'enviada', 'recibida', 'cancelada')) DEFAULT 'pendiente',
    total REAL DEFAULT 0,
    observaciones TEXT
);

-- Tabla de detalles de órdenes de compra
CREATE TABLE IF NOT EXISTS detalle_ordenes_compra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_id INTEGER NOT NULL REFERENCES ordenes_compra(id),
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    subtotal REAL GENERATED ALWAYS AS (cantidad * precio_unitario),
    recibido BOOLEAN DEFAULT 0,
    cantidad_recibida INTEGER DEFAULT 0
);

-- Tabla de códigos de barras
CREATE TABLE IF NOT EXISTS codigos_barras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    codigo_barras TEXT UNIQUE NOT NULL,
    tipo_codigo TEXT DEFAULT 'CODE128',
    generado_automaticamente BOOLEAN DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de logs de actividad del sistema
CREATE TABLE IF NOT EXISTS logs_actividad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER REFERENCES usuarios(id),
    accion TEXT NOT NULL,
    tabla_afectada TEXT,
    registro_id INTEGER,
    datos_anteriores TEXT, -- JSON
    datos_nuevos TEXT, -- JSON
    direccion_ip TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_proveedor ON productos(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_productos_stock_bajo ON productos(stock_actual, stock_minimo);
CREATE INDEX IF NOT EXISTS idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_inventario(fecha);
CREATE INDEX IF NOT EXISTS idx_solicitudes_empleado ON solicitudes_materiales(empleado_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_materiales(estado);
CREATE INDEX IF NOT EXISTS idx_prestamos_empleado ON prestamos_herramientas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_estado ON prestamos_herramientas(estado);

-- Triggers para actualizar campos de fecha
CREATE TRIGGER IF NOT EXISTS update_producto_timestamp 
    AFTER UPDATE ON productos
    FOR EACH ROW
    BEGIN
        UPDATE productos SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_usuario_timestamp 
    AFTER UPDATE ON usuarios
    FOR EACH ROW
    BEGIN
        UPDATE usuarios SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Datos iniciales del sistema
INSERT OR IGNORE INTO usuarios (id, username, password, name, role, active, email) VALUES 
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador TAKAB', 'admin', 1, 'admin@takab.com'),
(2, 'almacen', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Empleado de Almacén', 'almacen', 1, 'almacen@takab.com'),
(3, 'empleado', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan Pérez', 'empleado', 1, 'juan.perez@takab.com');

INSERT OR IGNORE INTO almacenes (id, nombre, ubicacion, responsable) VALUES 
(1, 'Almacén 1', 'Planta Baja - Bodega Principal', 'Empleado de Almacén'),
(2, 'Almacén 2', 'Segundo Piso - Herramientas', 'Empleado de Almacén');

INSERT OR IGNORE INTO categorias (id, nombre, descripcion) VALUES 
(1, 'Herramientas Eléctricas', 'Taladros, sierras, multímetros, etc.'),
(2, 'Cables y Conductores', 'Cables de diferentes calibres y tipos'),
(3, 'Conectores y Accesorios', 'Conectores, terminales, empalmes'),
(4, 'Tornillería y Ferretería', 'Tornillos, tuercas, anclas, etc.'),
(5, 'Equipos de Protección', 'Cascos, guantes, arneses, etc.'),
(6, 'Instalación de Redes', 'Cables UTP, conectores RJ45, switches');

INSERT OR IGNORE INTO unidades_medida (id, nombre, abreviacion) VALUES 
(1, 'Pieza', 'pza'),
(2, 'Metro', 'm'),
(3, 'Kilogramo', 'kg'),
(4, 'Caja', 'caja'),
(5, 'Rollo', 'rollo'),
(6, 'Par', 'par'),
(7, 'Litro', 'l'),
(8, 'Juego', 'jgo');
