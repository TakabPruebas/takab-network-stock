
import React from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Package, Ruler, DollarSign, MapPin } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onEdit: () => void;
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onEdit, onClose }) => {
  const getStockBadgeVariant = (stock: number, minStock: number) => {
    if (stock === 0) return 'destructive';
    if (stock <= minStock) return 'outline';
    return 'default';
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Nuevo': return 'default';
      case 'Usado': return 'secondary';
      case 'Dañado': return 'destructive';
      case 'En reparación': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
            <p className="text-gray-600">Código: {product.codigo}</p>
          </div>
        </div>
        <Button onClick={onEdit} className="bg-takab-600 hover:bg-takab-700">
          <Edit className="h-4 w-4 mr-2" />
          Editar Producto
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Información General</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-lg font-semibold">{product.nombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Código</label>
                <p className="font-mono text-lg">{product.codigo}</p>
              </div>
            </div>

            {product.descripcion && (
              <div>
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <p className="text-gray-700">{product.descripcion}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Marca</label>
                <p>{product.marca || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Color</label>
                <p>{product.color || 'No especificado'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Origen</label>
                <p>{product.origen || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Unidad de Medida</label>
                <p>{product.unidad_medida || 'No especificado'}</p>
              </div>
            </div>

            {product.especificaciones && (
              <div>
                <label className="text-sm font-medium text-gray-500">Especificaciones</label>
                <p className="text-gray-700">{product.especificaciones}</p>
              </div>
            )}

            <div className="flex space-x-2">
              <Badge variant={getEstadoBadgeVariant(product.estado)}>
                {product.estado}
              </Badge>
              {product.es_herramienta && (
                <Badge variant="outline">Herramienta</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estado y Stock */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Inventario</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Stock Actual</label>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{product.stock_actual}</p>
                  <Badge variant={getStockBadgeVariant(product.stock_actual, product.stock_minimo)}>
                    {product.stock_actual <= product.stock_minimo ? 'Stock Bajo' : 'Disponible'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Stock Mínimo</label>
                <p className="text-lg">{product.stock_minimo}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Ubicación</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{product.ubicacion}</p>
            </CardContent>
          </Card>
        </div>

        {/* Dimensiones */}
        {(product.peso || product.anchura || product.profundidad || product.alto) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Ruler className="h-5 w-5" />
                <span>Dimensiones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.peso && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Peso</label>
                  <p>{product.peso} kg</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                {product.anchura && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ancho</label>
                    <p>{product.anchura} cm</p>
                  </div>
                )}
                {product.profundidad && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Profundidad</label>
                    <p>{product.profundidad} cm</p>
                  </div>
                )}
                {product.alto && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Alto</label>
                    <p>{product.alto} cm</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Precios */}
        {(product.costo_compra || product.precio_venta) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Precios</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.costo_compra && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Costo de Compra</label>
                  <p className="text-lg font-semibold">${product.costo_compra.toFixed(2)}</p>
                </div>
              )}
              {product.precio_venta && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Precio de Venta</label>
                  <p className="text-lg font-semibold">${product.precio_venta.toFixed(2)}</p>
                </div>
              )}
              {product.costo_compra && product.precio_venta && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Margen</label>
                  <p className="text-lg font-semibold text-green-600">
                    ${(product.precio_venta - product.costo_compra).toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Información Adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
              <p>{new Date(product.fecha_creacion).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Categoría ID</label>
              <p>{product.categoria_id || 'No asignado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Proveedor ID</label>
              <p>{product.proveedor_id || 'No asignado'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
