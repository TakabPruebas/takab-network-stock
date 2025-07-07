
export type UserRole = 'admin' | 'almacen' | 'empleado';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  active: boolean;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// Internal database user type that includes password
export interface DatabaseUser extends User {
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface UserManagement {
  users: User[];
  createUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }) => Promise<boolean>;
  updateUser: (id: number, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  toggleUserStatus: (id: number) => Promise<boolean>;
}

export interface Product {
  id: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  proveedor_id?: number;
  categoria_id?: number;
  peso?: number;
  anchura?: number;
  profundidad?: number;
  alto?: number;
  unidad_medida?: string;
  marca?: string;
  color?: string;
  especificaciones?: string;
  origen?: string;
  costo_compra?: number;
  precio_venta?: number;
  stock_minimo: number;
  stock_actual: number;
  ubicacion: 'Almacén 1' | 'Almacén 2';
  estado: 'Nuevo' | 'Usado' | 'Dañado' | 'En reparación';
  es_herramienta: boolean;
  fecha_creacion: string;
}

export interface MaterialRequest {
  id: number;
  empleado_id: number;
  empleado_nombre: string;
  fecha_solicitud: string;
  estado: 'pendiente' | 'aprobado' | 'entregado' | 'devuelto' | 'rechazado';
  comentario: string;
  proyecto?: string;
  aprobado_por?: number;
  fecha_aprobacion?: string;
  fecha_entrega?: string;
  fecha_devolucion?: string;
  items: MaterialRequestItem[];
}

export interface MaterialRequestItem {
  id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  es_consumible: boolean;
  cantidad_entregada?: number;
  cantidad_devuelta?: number;
  estado_devolucion?: 'Bueno' | 'Dañado' | 'Perdido';
}

export interface DashboardStats {
  total_productos: number;
  productos_bajo_stock: number;
  solicitudes_pendientes: number;
  herramientas_prestadas: number;
  valor_inventario: number;
  alertas: Alert[];
}

export interface Alert {
  id: number;
  tipo: 'stock_bajo' | 'herramienta_vencida' | 'producto_dañado';
  mensaje: string;
  fecha: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Supplier {
  id: number;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

// SQLite Database Schema Types
export interface DatabaseSchema {
  usuarios: {
    id: number;
    username: string;
    password: string;
    name: string;
    role: UserRole;
    active: boolean;
    email?: string;
    created_at: string;
    updated_at: string;
  };
  productos: {
    id: number;
    codigo?: string;
    nombre: string;
    descripcion?: string;
    proveedor_id?: number;
    categoria_id?: number;
    peso?: number;
    anchura?: number;
    profundidad?: number;
    alto?: number;
    unidad_medida?: string;
    marca?: string;
    color?: string;
    especificaciones?: string;
    origen?: string;
    costo_compra?: number;
    precio_venta?: number;
    stock_minimo: number;
    stock_actual: number;
    ubicacion: string;
    estado: string;
    es_herramienta: boolean;
    fecha_creacion: string;
  };
  categorias: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
  proveedores: {
    id: number;
    nombre: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
  };
}
