
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Calendar, User, Cog, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
    });
  };

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/' },
    ];

    if (user?.role === 'empleado') {
      return [
        ...commonItems,
        { id: 'solicitudes', name: 'Mis Solicitudes', icon: Calendar, path: '/solicitudes' },
        { id: 'solicitar', name: 'Solicitar Material', icon: Calendar, path: '/solicitar' },
      ];
    }

    if (user?.role === 'almacen') {
      return [
        ...commonItems,
        { id: 'solicitudes', name: 'Solicitudes', icon: Calendar, path: '/solicitudes' },
        { id: 'productos', name: 'Productos', icon: Calendar, path: '/productos' },
        { id: 'inventario', name: 'Inventario', icon: Calendar, path: '/inventario' },
      ];
    }

    // Admin
    return [
      ...commonItems,
      { id: 'solicitudes', name: 'Solicitudes', icon: Calendar, path: '/solicitudes' },
      { id: 'productos', name: 'Productos', icon: Calendar, path: '/productos' },
      { id: 'inventario', name: 'Inventario', icon: Calendar, path: '/inventario' },
      { id: 'usuarios', name: 'Usuarios', icon: Users, path: '/usuarios' },
      { id: 'reportes', name: 'Reportes', icon: Calendar, path: '/reportes' },
      { id: 'configuracion', name: 'Configuración', icon: Cog, path: '/configuracion' },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="takab-gradient shadow-lg border-b border-takab-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center electric-glow">
                <span className="text-lg font-bold text-takab-900">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TAKAB</h1>
                <p className="text-takab-300 text-sm">{currentPage}</p>
              </div>
            </div>

            {/* Usuario y logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-takab-300 text-sm capitalize">{user?.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-takab-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-takab-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-takab-50 hover:text-takab-800 transition-colors group"
                >
                  <item.icon className="h-5 w-5 mr-3 text-takab-600 group-hover:text-takab-800" />
                  {item.name}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
