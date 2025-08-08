import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Package,
  Users,
  AlertCircle 
} from 'lucide-react';

const ReportesManagement: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('2024-01-01');
  const [fechaFin, setFechaFin] = useState('2024-01-31');
  const [tipoReporte, setTipoReporte] = useState('inventario');

  // Mock data para reportes
  const reporteInventario = {
    resumen: {
      totalProductos: 1247,
      valorTotal: 2840750,
      productosStockBajo: 23,
      rotacionPromedio: 4.2
    },
    categorias: [
      { categoria: 'Cables', productos: 45, valor: 850000, porcentaje: 30 },
      { categoria: 'CCTV', productos: 23, valor: 1200000, porcentaje: 42 },
      { categoria: 'Conectores', productos: 156, valor: 320000, porcentaje: 11 },
      { categoria: 'Herramientas', productos: 89, valor: 470750, porcentaje: 17 }
    ],
    productosTop: [
      { producto: 'Cable UTP Cat6', movimientos: 1250, valor: 156250 },
      { producto: 'Cámara IP 4MP', movimientos: 89, valor: 249200 },
      { producto: 'Switch 24 puertos', movimientos: 34, valor: 170000 },
      { producto: 'Conectores RJ45', movimientos: 2100, valor: 52500 }
    ]
  };

  const reporteSolicitudes = {
    resumen: {
      totalSolicitudes: 156,
      solicitudesPendientes: 8,
      solicitudesAprobadas: 128,
      solicitudesRechazadas: 12,
      tiempoPromedioAprobacion: 2.5
    },
    porEmpleado: [
      { empleado: 'Juan Pérez', solicitudes: 23, aprobadas: 21, rechazadas: 2 },
      { empleado: 'María López', solicitudes: 18, aprobadas: 17, rechazadas: 1 },
      { empleado: 'Carlos Ruiz', solicitudes: 15, aprobadas: 14, rechazadas: 1 },
      { empleado: 'Ana García', solicitudes: 12, aprobadas: 10, rechazadas: 2 }
    ],
    tendenciaMensual: [
      { mes: 'Octubre', solicitudes: 45, aprobadas: 41, rechazadas: 4 },
      { mes: 'Noviembre', solicitudes: 52, aprobadas: 48, rechazadas: 4 },
      { mes: 'Diciembre', solicitudes: 59, aprobadas: 54, rechazadas: 5 }
    ]
  };

  const reporteFinanciero = {
    resumen: {
      valorInventario: 2840750,
      costoPromedioPorSolicitud: 18250,
      ahorroPorOptimizacion: 125000,
      inversionMensual: 450000
    },
    gastosCategoria: [
      { categoria: 'Compras Material', monto: 890000, porcentaje: 65 },
      { categoria: 'Herramientas', monto: 280000, porcentaje: 20 },
      { categoria: 'Mantenimiento', monto: 150000, porcentaje: 11 },
      { categoria: 'Otros', monto: 50000, porcentaje: 4 }
    ]
  };

  const handleDescargarReporte = () => {
    // Simulación de descarga
    const fileName = `reporte_${tipoReporte}_${fechaInicio}_${fechaFin}.pdf`;
    console.log(`Descargando: ${fileName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Analíticas</h1>
          <p className="text-gray-600">Análisis detallado del sistema de inventario</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo de Reporte</Label>
              <Select value={tipoReporte} onValueChange={setTipoReporte}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventario">Inventario</SelectItem>
                  <SelectItem value="solicitudes">Solicitudes</SelectItem>
                  <SelectItem value="financiero">Financiero</SelectItem>
                  <SelectItem value="usuarios">Usuarios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleDescargarReporte}
                className="w-full bg-takab-600 hover:bg-takab-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tipoReporte} onValueChange={setTipoReporte}>
        <TabsList>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
          <TabsTrigger value="financiero">Financiero</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="inventario" className="space-y-6">
          {/* Métricas de Inventario */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Productos</p>
                    <p className="text-2xl font-bold">{reporteInventario.resumen.totalProductos}</p>
                  </div>
                  <Package className="h-8 w-8 text-takab-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold">
                      ${reporteInventario.resumen.valorTotal.toLocaleString('es-MX')}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                    <p className="text-2xl font-bold text-red-600">
                      {reporteInventario.resumen.productosStockBajo}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rotación</p>
                    <p className="text-2xl font-bold">
                      {reporteInventario.resumen.rotacionPromedio}x
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución por Categorías */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reporteInventario.categorias.map((cat, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{cat.categoria}</TableCell>
                        <TableCell>{cat.productos}</TableCell>
                        <TableCell>${cat.valor.toLocaleString('es-MX')}</TableCell>
                        <TableCell>{cat.porcentaje}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Productos Top */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Solicitados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Movimientos</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reporteInventario.productosTop.map((prod, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{prod.producto}</TableCell>
                        <TableCell>{prod.movimientos}</TableCell>
                        <TableCell>${prod.valor.toLocaleString('es-MX')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="solicitudes" className="space-y-6">
          {/* Métricas de Solicitudes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{reporteSolicitudes.resumen.totalSolicitudes}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {reporteSolicitudes.resumen.solicitudesPendientes}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reporteSolicitudes.resumen.solicitudesAprobadas}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {reporteSolicitudes.resumen.solicitudesRechazadas}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo Prom.</p>
                  <p className="text-2xl font-bold">
                    {reporteSolicitudes.resumen.tiempoPromedioAprobacion}d
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Solicitudes por Empleado */}
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes por Empleado</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Aprobadas</TableHead>
                      <TableHead>Rechazadas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reporteSolicitudes.porEmpleado.map((emp, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{emp.empleado}</TableCell>
                        <TableCell>{emp.solicitudes}</TableCell>
                        <TableCell className="text-green-600">{emp.aprobadas}</TableCell>
                        <TableCell className="text-red-600">{emp.rechazadas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Tendencia Mensual */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mes</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Aprobadas</TableHead>
                      <TableHead>Rechazadas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reporteSolicitudes.tendenciaMensual.map((mes, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{mes.mes}</TableCell>
                        <TableCell>{mes.solicitudes}</TableCell>
                        <TableCell className="text-green-600">{mes.aprobadas}</TableCell>
                        <TableCell className="text-red-600">{mes.rechazadas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financiero" className="space-y-6">
          {/* Métricas Financieras */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
                  <p className="text-2xl font-bold">
                    ${reporteFinanciero.resumen.valorInventario.toLocaleString('es-MX')}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Costo Prom. Solicitud</p>
                  <p className="text-2xl font-bold">
                    ${reporteFinanciero.resumen.costoPromedioPorSolicitud.toLocaleString('es-MX')}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ahorro Optimización</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${reporteFinanciero.resumen.ahorroPorOptimizacion.toLocaleString('es-MX')}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inversión Mensual</p>
                  <p className="text-2xl font-bold">
                    ${reporteFinanciero.resumen.inversionMensual.toLocaleString('es-MX')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Porcentaje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporteFinanciero.gastosCategoria.map((gasto, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{gasto.categoria}</TableCell>
                      <TableCell>${gasto.monto.toLocaleString('es-MX')}</TableCell>
                      <TableCell>{gasto.porcentaje}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          {/* Métricas de Usuarios */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                    <p className="text-2xl font-bold">18</p>
                  </div>
                  <Users className="h-8 w-8 text-takab-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                    <p className="text-2xl font-bold text-green-600">16</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inactivos</p>
                    <p className="text-2xl font-bold text-red-600">2</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nuevos (Mes)</p>
                    <p className="text-2xl font-bold text-blue-600">3</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usuarios por Rol */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rol</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Porcentaje</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Administrador</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>17%</TableCell>
                      <TableCell><span className="text-green-600">Activos</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Almacén</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>28%</TableCell>
                      <TableCell><span className="text-green-600">Activos</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Empleado</TableCell>
                      <TableCell>10</TableCell>
                      <TableCell>55%</TableCell>
                      <TableCell><span className="text-green-600">8 Activos</span></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Actividad Reciente */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Solicitudes</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Juan Pérez</TableCell>
                      <TableCell>Hoy 09:15</TableCell>
                      <TableCell>23</TableCell>
                      <TableCell><span className="text-green-600">Activo</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">María López</TableCell>
                      <TableCell>Ayer 16:30</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell><span className="text-green-600">Activo</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Carlos Ruiz</TableCell>
                      <TableCell>Hace 3 días</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell><span className="text-yellow-600">Inactivo</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ana García</TableCell>
                      <TableCell>Hoy 11:45</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell><span className="text-green-600">Activo</span></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas Adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Productividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Promedio Solicitudes/Usuario</p>
                  <p className="text-3xl font-bold text-blue-600">8.7</p>
                  <p className="text-xs text-gray-500">Por mes</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Tasa de Aprobación</p>
                  <p className="text-3xl font-bold text-green-600">89%</p>
                  <p className="text-xs text-gray-500">Solicitudes aprobadas</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Tiempo Promedio Sesión</p>
                  <p className="text-3xl font-bold text-purple-600">2.4h</p>
                  <p className="text-xs text-gray-500">Por día</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportesManagement;