import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, Database, Home, Users, Settings } from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import { dashboardService } from '@/services/dashboardService';
import { DashboardStats } from '@/types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dashboardStats, requests] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentMaterialRequests()
      ]);
      
      setStats(dashboardStats);
      setRecentRequests(requests);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'aprobado': 'bg-blue-100 text-blue-800',
      'entregado': 'bg-green-100 text-green-800',
      'alta': 'bg-red-100 text-red-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'baja': 'bg-gray-100 text-gray-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-takab-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role === 'admin') {
    if (!stats) return <div>Error al cargar datos</div>;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Gestión completa del sistema de inventario TAKAB</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Último actualizado</p>
            <p className="font-medium">{new Date().toLocaleString('es-MX')}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Métricas principales - ahora usando datos reales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="takab-card text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-takab-300 text-sm font-medium">Total Productos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_productos.toLocaleString()}</div>
                  <p className="text-takab-400 text-sm">En ambos almacenes</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-600 text-sm font-medium">Stock Bajo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">{stats.productos_bajo_stock}</div>
                  <p className="text-red-600 text-sm">Requieren restock</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-600 text-sm font-medium">Solicitudes Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-700">{stats.solicitudes_pendientes}</div>
                  <p className="text-yellow-600 text-sm">Por aprobar</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-600 text-sm font-medium">Herramientas Prestadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">{stats.herramientas_prestadas}</div>
                  <p className="text-blue-600 text-sm">En campo</p>
                </CardContent>
              </Card>
            </div>

            {/* Valor del inventario - datos reales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-takab-600" />
                  Valor Total del Inventario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-takab-800 mb-2">
                  {formatCurrency(stats.valor_inventario)}
                </div>
                <p className="text-gray-600">Valor estimado de todos los productos en inventario</p>
              </CardContent>
            </Card>

            {/* Alertas - datos reales */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Alertas del Sistema</CardTitle>
                <CardDescription>Elementos que requieren atención inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.alertas.length > 0 ? (
                    stats.alertas.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{alert.mensaje}</p>
                          <p className="text-sm text-gray-500">{new Date(alert.fecha).toLocaleDateString('es-MX')}</p>
                        </div>
                        <Badge className={getStatusBadge(alert.prioridad)}>
                          {alert.prioridad}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay alertas activas</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Solicitudes recientes - datos reales */}
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes Recientes</CardTitle>
                <CardDescription>Últimas solicitudes de material</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{request.empleado_nombre}</p>
                          <p className="text-sm text-gray-600">{request.proyecto || 'Sin proyecto especificado'}</p>
                          <p className="text-xs text-gray-500">{new Date(request.fecha_solicitud).toLocaleDateString('es-MX')}</p>
                        </div>
                        <Badge className={getStatusBadge(request.estado)}>
                          {request.estado}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay solicitudes recientes</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>Configuraciones generales y base de datos SQLite</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-green-800">Base de Datos SQLite</h4>
                      <p className="text-sm text-green-600">Sistema funcionando correctamente</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar Categorías
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Database className="mr-2 h-4 w-4" />
                      Respaldar Base de Datos
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar Almacenes
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Unidades de Medida
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  
  if (user?.role === 'almacen') {
    if (!stats) return <div>Error al cargar datos</div>;
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Almacén</h1>
          <p className="text-gray-600">Gestión diaria de inventario y solicitudes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-600 text-sm font-medium">Solicitudes Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{stats.solicitudes_pendientes}</div>
              <p className="text-yellow-600 text-sm">Por revisar</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-600 text-sm font-medium">Entregas Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Assuming you have a field for completed deliveries today in your stats */}
              <div className="text-2xl font-bold text-green-700">0</div>
              <p className="text-green-600 text-sm">Completadas</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-600 text-sm font-medium">Herramientas Prestadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.herramientas_prestadas}</div>
              <p className="text-blue-600 text-sm">En campo</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-600 text-sm font-medium">Stock Bajo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{stats.productos_bajo_stock}</div>
              <p className="text-red-600 text-sm">Requieren restock</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Operaciones frecuentes del almacén</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-takab-600 hover:bg-takab-700">
                <Calendar className="mr-2 h-4 w-4" />
                Revisar Solicitudes Pendientes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" />
                Gestionar Inventario
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Productos con Stock Bajo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium text-sm">{request.empleado_nombre}</p>
                      <p className="text-xs text-gray-500">{new Date(request.fecha_solicitud).toLocaleDateString()}</p>
                    </div>
                    <Badge className={getStatusBadge(request.estado)}>
                      {request.estado}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard para empleados
  const stats = {
    solicitudes_activas: 3,
    solicitudes_pendientes: 1,
    herramientas_prestadas: 2,
    ultima_solicitud: '2024-01-06',
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-600">Gestiona tus solicitudes de material</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-600 text-sm font-medium">Solicitudes Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.solicitudes_activas}</div>
            <p className="text-blue-600 text-sm">En proceso</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-600 text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.solicitudes_pendientes}</div>
            <p className="text-yellow-600 text-sm">Por aprobar</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-600 text-sm font-medium">Herramientas en Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.herramientas_prestadas}</div>
            <p className="text-green-600 text-sm">Por devolver</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Operaciones más comunes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-takab-600 hover:bg-takab-700">
              <Calendar className="mr-2 h-4 w-4" />
              Nueva Solicitud de Material
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Ver Mis Solicitudes
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Herramientas por Devolver
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Mis Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Material para Torre A</p>
                  <p className="text-xs text-gray-500">Enviada: 07/01/2024</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">pendiente</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Herramientas mantenimiento</p>
                  <p className="text-xs text-gray-500">Aprobada: 06/01/2024</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">aprobado</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Cables y conectores</p>
                  <p className="text-xs text-gray-500">Entregada: 05/01/2024</p>
                </div>
                <Badge className="bg-green-100 text-green-800">entregado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
