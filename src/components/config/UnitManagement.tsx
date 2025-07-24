import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configService } from '@/services/configService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UnitManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    abreviacion: '',
    descripcion: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: units, isLoading } = useQuery({
    queryKey: ['units'],
    queryFn: configService.getUnits
  });

  const createMutation = useMutation({
    mutationFn: configService.createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast({ title: 'Unidad creada exitosamente' });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      configService.updateUnit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast({ title: 'Unidad actualizada exitosamente' });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: configService.deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast({ title: 'Unidad eliminada exitosamente' });
    }
  });

  const resetForm = () => {
    setFormData({ nombre: '', abreviacion: '', descripcion: '' });
    setEditingUnit(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUnit) {
      updateMutation.mutate({ id: editingUnit.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (unit: any) => {
    setEditingUnit(unit);
    setFormData({
      nombre: unit.nombre,
      abreviacion: unit.abreviacion,
      descripcion: unit.descripcion
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta unidad?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Unidades de Medida</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Unidad
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingUnit ? 'Editar' : 'Nueva'} Unidad de Medida</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Abreviación</label>
                  <Input
                    value={formData.abreviacion}
                    onChange={(e) => setFormData({ ...formData, abreviacion: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <Textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando unidades...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Abreviación</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(units as any[])?.map((unit: any) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.nombre}</TableCell>
                    <TableCell>{unit.abreviacion}</TableCell>
                    <TableCell>{unit.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(unit)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(unit.id)}
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

export default UnitManagement;