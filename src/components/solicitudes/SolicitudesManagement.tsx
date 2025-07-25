import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, User, Package, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Solicitud {
  id: number;
  empleado: string;
  empleadoId: number;
  proyecto: string;
  fechaSolicitud: string;
  fechaRequerida: string;
  estado: 'pendiente' | 'aprobado' | 'entregado' | 'rechazado';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  items: {
    producto: string;
    cantidad: number;
    unidad: string;
  }[];
  observaciones?: string;
  observacionesRechazo?: string;
}

interface SolicitudesManagementProps {
  userRole: string;
}

const SolicitudesManagement: React.FC<SolicitudesManagementProps> = ({ userRole }) => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [activeTab, setActiveTab] = useState('todas');
  const { toast } = useToast();

  // Mock data
  useEffect(() => {
    const mockSolicitudes: Solicitud[] = [
      {
        id: 1,
        empleado: 'Juan Pérez',
        empleadoId: 3,
        proyecto: 'Instalación Centro Comercial Plaza Norte',
        fechaSolicitud: '2024-01-07',
        fechaRequerida: '2024-01-10',
        estado: 'pendiente',
        prioridad: 'alta',
        items: [
          { producto: 'Cable UTP Cat6', cantidad: 500, unidad: 'metros' },
          { producto: 'Conectores RJ45', cantidad: 50, unidad: 'piezas' },
          { producto: 'Canaleta 20x10mm', cantidad: 100, unidad: 'metros' }
        ],
        observaciones: 'Material necesario para instalación urgente de red en nuevo centro comercial'
      },
      {
        id: 2,
        empleado: 'María López',
        empleadoId: 4,
        proyecto: 'Mantenimiento Red Oficinas Torre A',
        fechaSolicitud: '2024-01-06',
        fechaRequerida: '2024-01-08',
        estado: 'aprobado',
        prioridad: 'media',
        items: [
          { producto: 'Switch 24 puertos', cantidad: 2, unidad: 'piezas' },
          { producto: 'Patch Cord Cat6', cantidad: 20, unidad: 'piezas' }
        ]
      },
      {
        id: 3,
        empleado: 'Carlos Ruiz',
        empleadoId: 5,
        proyecto: 'Instalación CCTV Almacén Central',
        fechaSolicitud: '2024-01-05',
        fechaRequerida: '2024-01-07',
        estado: 'entregado',
        prioridad: 'alta',
        items: [
          { producto: 'Cámara IP 4MP', cantidad: 8, unidad: 'piezas' },
          { producto: 'Cable Coaxial RG59', cantidad: 200, unidad: 'metros' },
          { producto: 'DVR 16 canales', cantidad: 1, unidad: 'pieza' }
        ]
      }
    ];
    setSolicitudes(mockSolicitudes);
  }, []);

  const getStatusColor = (estado: string) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      aprobado: 'bg-blue-100 text-blue-800',
      entregado: 'bg-green-100 text-green-800',
      rechazado: 'bg-red-100 text-red-800'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (prioridad: string) => {
    const colors = {
      baja: 'bg-gray-100 text-gray-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800'
    };
    return colors[prioridad as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = (solicitudId: number, nuevoEstado: string) => {
    setSolicitudes(prev => prev.map(sol => 
      sol.id === solicitudId ? { ...sol, estado: nuevoEstado as any } : sol
    ));
    toast({
      title: 'Estado actualizado',
      description: `La solicitud ha sido ${nuevoEstado}`,
    });
  };

  const filteredSolicitudes = solicitudes.filter(sol => {
    if (activeTab === 'todas') return true;
    if (activeTab === 'pendientes') return sol.estado === 'pendiente';
    if (activeTab === 'aprobadas') return sol.estado === 'aprobado';
    if (activeTab === 'entregadas') return sol.estado === 'entregado';
    return true;
  });

  const renderSolicitudCard = (solicitud: Solicitud) => (
    <Card key={solicitud.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{solicitud.proyecto}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {solicitud.empleado}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Solicitado: {solicitud.fechaSolicitud}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Requerido: {solicitud.fechaRequerida}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(solicitud.estado)}>
              {solicitud.estado}
            </Badge>
            <Badge className={getPriorityColor(solicitud.prioridad)}>
              {solicitud.prioridad}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items solicitados
            </h4>
            <div className="bg-gray-50 rounded-lg p-3">
              {solicitud.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span>{item.producto}</span>
                  <span className="text-sm text-gray-600">
                    {item.cantidad} {item.unidad}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {solicitud.observaciones && (
            <div>
              <h4 className="font-medium mb-2">Observaciones</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {solicitud.observaciones}
              </p>
            </div>
          )}

          {(userRole === 'admin' || userRole === 'almacen') && (
            <div className="flex gap-2 pt-4 border-t">
              {solicitud.estado === 'pendiente' && (
                <>
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange(solicitud.id, 'aprobado')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleStatusChange(solicitud.id, 'rechazado')}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                </>
              )}
              {solicitud.estado === 'aprobado' && (
                <Button 
                  size="sm" 
                  onClick={() => handleStatusChange(solicitud.id, 'entregado')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Marcar Entregado
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Solicitudes</h1>
          <p className="text-gray-600">
            {userRole === 'empleado' 
              ? 'Tus solicitudes de material' 
              : 'Gestiona las solicitudes de material del equipo'
            }
          </p>
        </div>
        {userRole === 'empleado' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-takab-600 hover:bg-takab-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Solicitud
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nueva Solicitud de Material</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proyecto">Proyecto</Label>
                    <Input id="proyecto" placeholder="Nombre del proyecto" />
                  </div>
                  <div>
                    <Label htmlFor="fechaRequerida">Fecha Requerida</Label>
                    <Input id="fechaRequerida" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea 
                    id="observaciones" 
                    placeholder="Describe el contexto y necesidades específicas..."
                    rows={3}
                  />
                </div>
                <Button 
                  className="w-full bg-takab-600 hover:bg-takab-700"
                  onClick={() => {
                    setIsDialogOpen(false);
                    toast({
                      title: 'Solicitud creada',
                      description: 'Tu solicitud ha sido enviada para revisión',
                    });
                  }}
                >
                  Enviar Solicitud
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
          <TabsTrigger value="entregadas">Entregadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredSolicitudes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay solicitudes
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'todas' 
                    ? 'No se encontraron solicitudes' 
                    : `No hay solicitudes ${activeTab}`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {filteredSolicitudes.map(renderSolicitudCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SolicitudesManagement;