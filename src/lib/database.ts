
import Database from 'better-sqlite3';
import { User, Product, MaterialRequest, DashboardStats } from '@/types';

let db: Database.Database;

// Initialize database connection
export function initDatabase() {
  try {
    db = new Database('takab_inventory.db');
    db.pragma('journal_mode = WAL');
    
    // Create tables if they don't exist
    createTables();
    
    // Insert initial data if tables are empty
    insertInitialData();
    
    console.log('Base de datos SQLite inicializada correctamente');
    return db;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Create database tables
function createTables() {
  const createTablesSQL = `
    -- Tabla de usuarios del sistema
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        fecha_devolucion DATETIME
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
        estado_devolucion TEXT CHECK(estado_devolucion IN ('Bueno', 'Dañado', 'Perdido'))
    );
  `;

  db.exec(createTablesSQL);
}

// Insert initial data
function insertInitialData() {
  // Check if users table has data
  const userCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get() as { count: number };
  
  if (userCount.count === 0) {
    // Insert initial users
    const insertUser = db.prepare(`
      INSERT INTO usuarios (username, password, name, role, active, email) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('admin', 'admin123', 'Administrador TAKAB', 'admin', 1, 'admin@takab.com');
    insertUser.run('almacen', 'almacen123', 'Empleado de Almacén', 'almacen', 1, 'almacen@takab.com');
    insertUser.run('empleado', 'empleado123', 'Juan Pérez', 'empleado', 1, 'juan.perez@takab.com');

    // Insert initial categories
    const insertCategory = db.prepare('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)');
    insertCategory.run('Herramientas Eléctricas', 'Taladros, sierras, multímetros, etc.');
    insertCategory.run('Cables y Conductores', 'Cables de diferentes calibres y tipos');
    insertCategory.run('Conectores y Accesorios', 'Conectores, terminales, empalmes');
    insertCategory.run('Tornillería y Ferretería', 'Tornillos, tuercas, anclas, etc.');

    console.log('Datos iniciales insertados en la base de datos');
  }
}

// Get database instance
export function getDatabase() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

// User operations
export const userOperations = {
  // Get all users
  getAllUsers: (): User[] => {
    const stmt = db.prepare('SELECT * FROM usuarios ORDER BY created_at DESC');
    return stmt.all() as User[];
  },

  // Get user by username
  getUserByUsername: (username: string): User | null => {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE username = ?');
    return stmt.get(username) as User | null;
  },

  // Create new user
  createUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): boolean => {
    try {
      const stmt = db.prepare(`
        INSERT INTO usuarios (username, password, name, role, active, email) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        userData.username,
        userData.password,
        userData.name,
        userData.role,
        userData.active ? 1 : 0,
        userData.email || null
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return false;
    }
  },

  // Update user
  updateUser: (id: number, userData: Partial<User>): boolean => {
    try {
      const stmt = db.prepare(`
        UPDATE usuarios 
        SET username = ?, name = ?, role = ?, active = ?, email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      const result = stmt.run(
        userData.username,
        userData.name,
        userData.role,
        userData.active ? 1 : 0,
        userData.email || null,
        id
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return false;
    }
  },

  // Delete user
  deleteUser: (id: number): boolean => {
    try {
      const stmt = db.prepare('DELETE FROM usuarios WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  },

  // Toggle user status
  toggleUserStatus: (id: number): boolean => {
    try {
      const stmt = db.prepare(`
        UPDATE usuarios 
        SET active = NOT active, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      return false;
    }
  }
};

// Dashboard operations
export const dashboardOperations = {
  // Get dashboard stats
  getDashboardStats: (userRole: string): DashboardStats => {
    const totalProductos = db.prepare('SELECT COUNT(*) as count FROM productos').get() as { count: number };
    const productosStockBajo = db.prepare('SELECT COUNT(*) as count FROM productos WHERE stock_actual <= stock_minimo').get() as { count: number };
    const solicitudesPendientes = db.prepare('SELECT COUNT(*) as count FROM solicitudes_materiales WHERE estado = "pendiente"').get() as { count: number };
    
    // Calculate inventory value
    const valorInventario = db.prepare('SELECT SUM(stock_actual * COALESCE(precio_venta, costo_compra, 0)) as valor FROM productos').get() as { valor: number };

    // Get alerts for low stock products
    const alertasStmt = db.prepare(`
      SELECT id, nombre, stock_actual, stock_minimo 
      FROM productos 
      WHERE stock_actual <= stock_minimo 
      ORDER BY stock_actual ASC 
      LIMIT 5
    `);
    const productosAlerta = alertasStmt.all();

    const alertas = productosAlerta.map((producto: any, index: number) => ({
      id: index + 1,
      tipo: 'stock_bajo' as const,
      mensaje: `${producto.nombre} tiene stock bajo (${producto.stock_actual}/${producto.stock_minimo})`,
      fecha: new Date().toISOString().split('T')[0],
      prioridad: producto.stock_actual === 0 ? 'alta' as const : 'media' as const
    }));

    return {
      total_productos: totalProductos.count,
      productos_bajo_stock: productosStockBajo.count,
      solicitudes_pendientes: solicitudesPendientes.count,
      herramientas_prestadas: 0, // TODO: Implement when loan system is ready
      valor_inventario: valorInventario.valor || 0,
      alertas
    };
  },

  // Get recent requests
  getRecentRequests: () => {
    const stmt = db.prepare(`
      SELECT sm.*, u.name as empleado_nombre
      FROM solicitudes_materiales sm
      JOIN usuarios u ON sm.empleado_id = u.id
      ORDER BY sm.fecha_solicitud DESC
      LIMIT 10
    `);
    return stmt.all();
  }
};

// Initialize database on module load
try {
  initDatabase();
} catch (error) {
  console.error('Error durante la inicialización de la base de datos:', error);
}
