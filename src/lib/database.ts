
import Database from 'better-sqlite3';
import { User, Product, Category, Supplier, MaterialRequest, MaterialRequestItem } from '@/types';

// Configuración de la base de datos
const DB_PATH = process.env.NODE_ENV === 'production' ? '/data/takab_inventory.db' : './takab_inventory.db';

class DatabaseManager {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Leer y ejecutar el schema SQL
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../database/sqlite-schema.sql');
    
    try {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      this.db.exec(schema);
      console.log('Base de datos SQLite inicializada correctamente');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  // Métodos para usuarios
  getUserByCredentials(username: string, password: string): User | null {
    const stmt = this.db.prepare(`
      SELECT id, username, name, role, active, email, created_at, updated_at 
      FROM usuarios 
      WHERE username = ? AND password = ? AND active = 1
    `);
    
    const result = stmt.get(username, password) as any;
    return result || null;
  }

  getAllUsers(): User[] {
    const stmt = this.db.prepare(`
      SELECT id, username, name, role, active, email, created_at, updated_at 
      FROM usuarios 
      ORDER BY created_at DESC
    `);
    
    return stmt.all() as User[];
  }

  createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): boolean {
    const stmt = this.db.prepare(`
      INSERT INTO usuarios (username, password, name, role, active, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    try {
      stmt.run(
        userData.username,
        userData.password, // En producción debería estar hasheada
        userData.name,
        userData.role,
        userData.active ? 1 : 0,
        userData.email || null
      );
      return true;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return false;
    }
  }

  updateUser(id: number, userData: Partial<User>): boolean {
    const fields = [];
    const values = [];
    
    if (userData.username) {
      fields.push('username = ?');
      values.push(userData.username);
    }
    if (userData.name) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    if (userData.email !== undefined) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.role) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    if (userData.active !== undefined) {
      fields.push('active = ?');
      values.push(userData.active ? 1 : 0);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?
    `);
    
    try {
      stmt.run(...values);
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return false;
    }
  }

  deleteUser(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM usuarios WHERE id = ? AND role != "admin"');
    
    try {
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  }

  // Métodos para productos
  getAllProducts(): Product[] {
    const stmt = this.db.prepare(`
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        pr.nombre as proveedor_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
      ORDER BY p.nombre
    `);
    
    return stmt.all().map((row: any) => ({
      id: row.id,
      codigo: row.codigo,
      nombre: row.nombre,
      descripcion: row.descripcion,
      proveedor_id: row.proveedor_id,
      categoria_id: row.categoria_id,
      peso: row.peso,
      anchura: row.anchura,
      profundidad: row.profundidad,
      alto: row.alto,
      unidad_medida: row.unidad_medida,
      marca: row.marca,
      color: row.color,
      especificaciones: row.especificaciones,
      origen: row.origen,
      costo_compra: row.costo_compra,
      precio_venta: row.precio_venta,
      stock_minimo: row.stock_minimo,
      stock_actual: row.stock_actual,
      ubicacion: row.ubicacion as 'Almacén 1' | 'Almacén 2',
      estado: row.estado as 'Nuevo' | 'Usado' | 'Dañado' | 'En reparación',
      es_herramienta: Boolean(row.es_herramienta),
      fecha_creacion: row.fecha_creacion
    })) as Product[];
  }

  // Métodos para solicitudes de material
  getAllMaterialRequests(): MaterialRequest[] {
    const stmt = this.db.prepare(`
      SELECT 
        sm.*,
        u.name as empleado_nombre
      FROM solicitudes_materiales sm
      JOIN usuarios u ON sm.empleado_id = u.id
      ORDER BY sm.fecha_solicitud DESC
    `);
    
    const requests = stmt.all();
    
    return requests.map((request: any) => ({
      id: request.id,
      empleado_id: request.empleado_id,
      empleado_nombre: request.empleado_nombre,
      fecha_solicitud: request.fecha_solicitud,
      estado: request.estado,
      comentario: request.comentario,
      proyecto: request.proyecto,
      aprobado_por: request.aprobado_por,
      fecha_aprobacion: request.fecha_aprobacion,
      fecha_entrega: request.fecha_entrega,
      fecha_devolucion: request.fecha_devolucion,
      items: this.getMaterialRequestItems(request.id)
    })) as MaterialRequest[];
  }

  private getMaterialRequestItems(solicitudId: number): MaterialRequestItem[] {
    const stmt = this.db.prepare(`
      SELECT 
        i.*,
        p.nombre as producto_nombre
      FROM items_solicitudes i
      JOIN productos p ON i.producto_id = p.id
      WHERE i.solicitud_id = ?
    `);
    
    return stmt.all(solicitudId).map((item: any) => ({
      id: item.id,
      producto_id: item.producto_id,
      producto_nombre: item.producto_nombre,
      cantidad: item.cantidad,
      es_consumible: Boolean(item.es_consumible),
      cantidad_entregada: item.cantidad_entregada,
      cantidad_devuelta: item.cantidad_devuelta,
      estado_devolucion: item.estado_devolucion
    })) as MaterialRequestItem[];
  }

  // Método para obtener estadísticas del dashboard
  getDashboardStats() {
    // Total de productos
    const totalProductos = this.db.prepare('SELECT COUNT(*) as count FROM productos').get() as { count: number };
    
    // Productos con stock bajo
    const stockBajo = this.db.prepare('SELECT COUNT(*) as count FROM productos WHERE stock_actual <= stock_minimo').get() as { count: number };
    
    // Solicitudes pendientes
    const solicitudesPendientes = this.db.prepare('SELECT COUNT(*) as count FROM solicitudes_materiales WHERE estado = "pendiente"').get() as { count: number };
    
    // Herramientas prestadas
    const herramientasPrestadas = this.db.prepare('SELECT COUNT(*) as count FROM prestamos_herramientas WHERE estado = "prestado"').get() as { count: number };
    
    // Valor del inventario
    const valorInventario = this.db.prepare('SELECT SUM(stock_actual * COALESCE(costo_compra, 0)) as total FROM productos').get() as { total: number };
    
    // Alertas
    const alertas = this.db.prepare(`
      SELECT 
        'stock_bajo' as tipo,
        'Producto ' || nombre || ' por debajo del stock mínimo' as mensaje,
        fecha_creacion as fecha,
        'alta' as prioridad
      FROM productos 
      WHERE stock_actual <= stock_minimo
      LIMIT 10
    `).all();
    
    return {
      total_productos: totalProductos.count,
      productos_bajo_stock: stockBajo.count,
      solicitudes_pendientes: solicitudesPendientes.count,
      herramientas_prestadas: herramientasPrestadas.count,
      valor_inventario: valorInventario.total || 0,
      alertas: alertas.map((alert: any, index: number) => ({
        id: index + 1,
        tipo: alert.tipo,
        mensaje: alert.mensaje,
        fecha: alert.fecha,
        prioridad: alert.prioridad
      }))
    };
  }

  close() {
    this.db.close();
  }
}

// Singleton para la base de datos
let dbInstance: DatabaseManager | null = null;

export const getDatabase = (): DatabaseManager => {
  if (!dbInstance) {
    dbInstance = new DatabaseManager();
  }
  return dbInstance;
};

export default DatabaseManager;
