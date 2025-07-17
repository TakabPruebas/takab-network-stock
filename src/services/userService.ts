
import { User, UserRole } from '@/types';

// Simulación de base de datos en memoria
let users: User[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Administrador TAKAB',
    role: 'admin',
    active: true,
    email: 'admin@takab.com'
  },
  {
    id: 2,
    username: 'almacen',
    name: 'Empleado de Almacén',
    role: 'almacen',
    active: true,
    email: 'almacen@takab.com'
  },
  {
    id: 3,
    username: 'empleado',
    name: 'Juan Pérez',
    role: 'empleado',
    active: true,
    email: 'juan.perez@takab.com'
  },
  {
    id: 4,
    username: 'maria.garcia',
    name: 'María García',
    role: 'empleado',
    active: false,
    email: 'maria.garcia@takab.com'
  }
];

let nextId = 5;

export const userService = {
  // Obtener todos los usuarios
  getUsers: (): User[] => {
    return users;
  },

  // Obtener usuarios activos
  getActiveUsers: (): User[] => {
    return users.filter(user => user.active);
  },

  // Obtener usuarios inactivos (extrabajadores)
  getInactiveUsers: (): User[] => {
    return users.filter(user => !user.active);
  },

  // Obtener usuario por ID
  getUserById: (id: number): User | undefined => {
    return users.find(user => user.id === id);
  },

  // Crear nuevo usuario
  createUser: (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      id: nextId++,
      ...userData
    };
    users.push(newUser);
    return newUser;
  },

  // Actualizar usuario
  updateUser: (id: number, updates: Partial<User>): User | null => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  },

  // Eliminar usuario (mover a inactivos)
  deleteUser: (id: number): boolean => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    users[userIndex].active = false;
    return true;
  },

  // Activar/Desactivar usuario
  toggleUserStatus: (id: number): boolean => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    users[userIndex].active = !users[userIndex].active;
    return true;
  },

  // Eliminar permanentemente
  permanentlyDeleteUser: (id: number): boolean => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    users.splice(userIndex, 1);
    return true;
  }
};
