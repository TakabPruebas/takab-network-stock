
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Database, Home } from 'lucide-react';

// Mock data para mostrar funcionalidad
const mockStats = {
  admin: {
    total_productos: 1247,
    productos_bajo_stock: 23,
    solicitudes_pendientes: 8,
    herramientas_prestadas: 15,
    valor_inventario: 2840750,
    alertas: [
      { id: 1, tipo: 'stock_bajo', mensaje: 'Cable UTP Cat6 por debajo del stock mínimo', fecha: '2024-01-07', prioridad: 'alta' },
      { id: 2, tipo: 'herramienta_vencida', mensaje: 'Multímetro Fluke no devuelto (5 días de retraso)', fecha: '2024-01-05', prioridad: 'alta' },
      { id: 3, tipo: 'stock_bajo', mensaje: 'Conectores RJ45 stock crítico', fecha: '2024-01-07', prioridad: 'media' },
    ]
  },
  almacen: {
    solicitudes_pendientes: 8,
    herramientas_prestadas: 15,
    productos_bajo_stock: 23,
    entregas_hoy: 5,
  },
  empleado: {
    solicitudes_activas: 3,
    solicitudes_pendientes: 1,
    herramientas_prestadas: 2,
    ultima_solicitud: '2024-01-06',
  }
};

const mockRecentRequests = [
  { id: 1, empleado: 'Carlos Ruiz', proyecto: 'Instalación Centro Comercial', fecha: '2024-01-07', estado: 'pendiente' },
  { id: 2, empleado: 'María López', proyecto: 'Red Oficinas Torre A', fecha: '2024-01-07', estado: 'aprobado' },
  { id: 3, empleado: 'Juan Pérez', proyecto: 'Mantenimiento Planta Industrial', fecha: '2024-01-06', estado: 'entregado' },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

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

  if (user?.role === 'admin') {
    const stats = mockStats.admin;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Resumen general del sistema de inventario TAKAB</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Último actualizado</p>
            <p className="font-medium">{new Date().toLocaleString('es-MX')}</p>
          </div>
        </div>

        {/* Métricas principales */}
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

        {/* Valor del inventario */}
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

        {/* Alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Alertas del Sistema</CardTitle>
            <CardDescription>Elementos que requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.alertas.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alert.mensaje}</p>
                    <p className="text-sm text-gray-500">{alert.fecha}</p>
                  </div>
                  <Badge className={getStatusBadge(alert.prioridad)}>
                    {alert.prioridad}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Solicitudes recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>Últimas solicitudes de material</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{request.empleado}</p>
                    <p className="text-sm text-gray-600">{request.proyecto}</p>
                    <p className="text-xs text-gray-500">{request.fecha}</p>
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
    );
  }

  if (user?.role === 'almacen') {
    const stats = mockStats.almacen;
    
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
              <div className="text-2xl font-bold text-green-700">{stats.entregas_hoy}</div>
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
                {mockRecentRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium text-sm">{request.empleado}</p>
                      <p className="text-xs text-gray-500">{request.fecha}</p>
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
  const stats = mockStats.empleado;
  
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
