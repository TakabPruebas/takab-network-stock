import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Package, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MovimientoInventario {
  id: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  producto: string;
  cantidad: number;
  fecha: string;
  usuario: string;
  referencia: string;
  observaciones?: string;
}

interface StockPorAlmacen {
  almacen: string;
  stock: number;
  stockMinimo: number;
  stockMaximo: number;
}

interface ProductoInventario {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  proveedor: string;
  stockTotal: number;
  stockMinimo: number;
  stockMaximo: number;
  valorUnitario: number;
  valorTotal: number;
  estado: 'normal' | 'bajo' | 'critico' | 'sobrestock';
  almacenes: StockPorAlmacen[];
  ultimoMovimiento: string;
}

interface InventarioManagementProps {
  userRole: string;
}

const InventarioManagement: React.FC<InventarioManagementProps> = ({ userRole }) => {
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('all');
  const [selectedAlmacen, setSelectedAlmacen] = useState('all');
  const [isMovimientoDialogOpen, setIsMovimientoDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data
  useEffect(() => {
    const mockProductos: ProductoInventario[] = [
      {
        id: 1,
        codigo: 'CBL-UTP-CAT6-001',
        nombre: 'Cable UTP Cat6',
        categoria: 'Cables',
        unidad: 'metros',
        proveedor: 'TechCorp',
        stockTotal: 2500,
        stockMinimo: 500,
        stockMaximo: 5000,
        valorUnitario: 12.50,
        valorTotal: 31250,
        estado: 'normal',
        almacenes: [
          { almacen: 'Almacén Principal', stock: 1800, stockMinimo: 300, stockMaximo: 3000 },
          { almacen: 'Almacén Sucursal', stock: 700, stockMinimo: 200, stockMaximo: 2000 }
        ],
        ultimoMovimiento: '2024-01-07'
      },
      {
        id: 2,
        codigo: 'CON-RJ45-001',
        nombre: 'Conectores RJ45',
        categoria: 'Conectores',
        unidad: 'piezas',
        proveedor: 'NetParts',
        stockTotal: 150,
        stockMinimo: 500,
        stockMaximo: 2000,
        valorUnitario: 2.50,
        valorTotal: 375,
        estado: 'critico',
        almacenes: [
          { almacen: 'Almacén Principal', stock: 100, stockMinimo: 300, stockMaximo: 1200 },
          { almacen: 'Almacén Sucursal', stock: 50, stockMinimo: 200, stockMaximo: 800 }
        ],
        ultimoMovimiento: '2024-01-06'
      },
      {
        id: 3,
        codigo: 'CAM-IP-4MP-001',
        nombre: 'Cámara IP 4MP',
        categoria: 'CCTV',
        unidad: 'piezas',
        proveedor: 'SecureTech',
        stockTotal: 45,
        stockMinimo: 10,
        stockMaximo: 100,
        valorUnitario: 2800,
        valorTotal: 126000,
        estado: 'normal',
        almacenes: [
          { almacen: 'Almacén Principal', stock: 30, stockMinimo: 6, stockMaximo: 60 },
          { almacen: 'Almacén Sucursal', stock: 15, stockMinimo: 4, stockMaximo: 40 }
        ],
        ultimoMovimiento: '2024-01-05'
      }
    ];

    const mockMovimientos: MovimientoInventario[] = [
      {
        id: 1,
        tipo: 'salida',
        producto: 'Cable UTP Cat6',
        cantidad: 500,
        fecha: '2024-01-07',
        usuario: 'María López',
        referencia: 'SOL-001',
        observaciones: 'Entrega para proyecto Centro Comercial'
      },
      {
        id: 2,
        tipo: 'entrada',
        producto: 'Cámara IP 4MP',
        cantidad: 20,
        fecha: '2024-01-06',
        usuario: 'Carlos Ruiz',
        referencia: 'PO-2024-001',
        observaciones: 'Compra mensual programada'
      },
      {
        id: 3,
        tipo: 'ajuste',
        producto: 'Conectores RJ45',
        cantidad: -25,
        fecha: '2024-01-05',
        usuario: 'Admin',
        referencia: 'AJ-001',
        observaciones: 'Ajuste por inventario físico'
      }
    ];

    setProductos(mockProductos);
    setMovimientos(mockMovimientos);
  }, []);

  const getEstadoColor = (estado: string) => {
    const colors = {
      normal: 'bg-green-100 text-green-800',
      bajo: 'bg-yellow-100 text-yellow-800',
      critico: 'bg-red-100 text-red-800',
      sobrestock: 'bg-blue-100 text-blue-800'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTipoMovimientoIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'salida':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'ajuste':
        return <ArrowRight className="h-4 w-4 text-blue-600" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === 'all' || producto.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });

  const stats = {
    totalProductos: productos.length,
    stockBajo: productos.filter(p => p.estado === 'bajo' || p.estado === 'critico').length,
    valorTotal: productos.reduce((sum, p) => sum + p.valorTotal, 0),
    movimientosHoy: movimientos.filter(m => m.fecha === '2024-01-07').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">Control de stock y movimientos de inventario</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isMovimientoDialogOpen} onOpenChange={setIsMovimientoDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Movimiento de Inventario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tipo de Movimiento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="salida">Salida</SelectItem>
                      <SelectItem value="ajuste">Ajuste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Producto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map(producto => (
                        <SelectItem key={producto.id} value={producto.id.toString()}>
                          {producto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cantidad</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Referencia</Label>
                    <Input placeholder="SOL-001, PO-001, etc." />
                  </div>
                </div>
                <Button 
                  className="w-full bg-takab-600 hover:bg-takab-700"
                  onClick={() => {
                    setIsMovimientoDialogOpen(false);
                    toast({
                      title: 'Movimiento registrado',
                      description: 'El movimiento de inventario ha sido registrado exitosamente',
                    });
                  }}
                >
                  Registrar Movimiento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold">{stats.totalProductos}</p>
              </div>
              <Package className="h-8 w-8 text-takab-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-red-600">{stats.stockBajo}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold">
                ${stats.valorTotal.toLocaleString('es-MX')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Movimientos Hoy</p>
              <p className="text-2xl font-bold">{stats.movimientosHoy}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="productos">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="productos" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Cables">Cables</SelectItem>
                <SelectItem value="Conectores">Conectores</SelectItem>
                <SelectItem value="CCTV">CCTV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Último Movimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-mono text-sm">{producto.codigo}</TableCell>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell>{producto.categoria}</TableCell>
                    <TableCell>
                      {producto.stockTotal} {producto.unidad}
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoColor(producto.estado)}>
                        {producto.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${producto.valorTotal.toLocaleString('es-MX')}
                    </TableCell>
                    <TableCell>{producto.ultimoMovimiento}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="movimientos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Referencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientos.map((movimiento) => (
                    <TableRow key={movimiento.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTipoMovimientoIcon(movimiento.tipo)}
                          <span className="capitalize">{movimiento.tipo}</span>
                        </div>
                      </TableCell>
                      <TableCell>{movimiento.producto}</TableCell>
                      <TableCell className={movimiento.cantidad < 0 ? 'text-red-600' : 'text-green-600'}>
                        {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                      </TableCell>
                      <TableCell>{movimiento.fecha}</TableCell>
                      <TableCell>{movimiento.usuario}</TableCell>
                      <TableCell>{movimiento.referencia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productos con Stock Bajo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productos.filter(p => p.estado === 'bajo' || p.estado === 'critico').map(producto => (
                    <div key={producto.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-sm text-gray-600">
                          Stock: {producto.stockTotal} | Mínimo: {producto.stockMinimo}
                        </p>
                      </div>
                      <Badge className={getEstadoColor(producto.estado)}>
                        {producto.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movimientos Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {movimientos.slice(0, 5).map(movimiento => (
                    <div key={movimiento.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTipoMovimientoIcon(movimiento.tipo)}
                        <div>
                          <p className="font-medium">{movimiento.producto}</p>
                          <p className="text-sm text-gray-600">{movimiento.fecha}</p>
                        </div>
                      </div>
                      <span className={movimiento.cantidad < 0 ? 'text-red-600' : 'text-green-600'}>
                        {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventarioManagement;