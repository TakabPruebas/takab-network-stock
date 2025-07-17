
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Trash2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';

const ProductManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts
  });

  const deleteProductMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado correctamente'
      });
    }
  });

  const filteredProducts = products?.filter(product =>
    product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.codigo?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

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

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  if (showDetails && selectedProduct) {
    return (
      <ProductDetails
        product={selectedProduct}
        onEdit={() => {
          setShowDetails(false);
          handleEditProduct(selectedProduct);
        }}
        onClose={() => {
          setShowDetails(false);
          setSelectedProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600">Administra el inventario de productos</p>
        </div>
        <Button onClick={handleAddProduct} className="bg-takab-600 hover:bg-takab-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-takab-600" />
              <div>
                <p className="text-2xl font-bold">{products?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Productos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {products?.filter(p => p.stock_actual <= p.stock_minimo).length || 0}
                </p>
                <p className="text-sm text-gray-600">Stock Bajo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {products?.filter(p => p.es_herramienta).length || 0}
                </p>
                <p className="text-sm text-gray-600">Herramientas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  ${products?.reduce((sum, p) => sum + (p.precio_venta || 0) * p.stock_actual, 0).toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-gray-600">Valor Inventario</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos por nombre o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando productos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono">{product.codigo}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.nombre}</p>
                        {product.es_herramienta && (
                          <Badge variant="outline" className="text-xs">Herramienta</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.categoria_id}</TableCell>
                    <TableCell>
                      <Badge variant={getStockBadgeVariant(product.stock_actual, product.stock_minimo)}>
                        {product.stock_actual}/{product.stock_minimo}
                      </Badge>
                    </TableCell>
                    <TableCell>${product.precio_venta?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadgeVariant(product.estado)}>
                        {product.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.ubicacion}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProduct(product)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Eliminar"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
