
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de prueba para desarrollo
const mockUsers: (User & { password: string })[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Administrador TAKAB',
    role: 'admin',
    active: true,
    email: 'admin@takab.com'
  },
  {
    id: 2,
    username: 'almacen',
    password: 'almacen123',
    name: 'Empleado de Almacén',
    role: 'almacen',
    active: true,
    email: 'almacen@takab.com'
  },
  {
    id: 3,
    username: 'empleado',
    password: 'empleado123',
    name: 'Juan Pérez',
    role: 'empleado',
    active: true,
    email: 'juan.perez@takab.com'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('takab_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error al cargar sesión guardada:', error);
        localStorage.removeItem('takab_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password && u.active
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('takab_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('takab_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
