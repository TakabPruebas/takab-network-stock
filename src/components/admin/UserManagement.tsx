
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    role: 'empleado' as UserRole,
    active: true
  });

  const loadUsers = () => {
    setActiveUsers(userService.getActiveUsers());
    setInactiveUsers(userService.getInactiveUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleNewUser = () => {
    setIsNewUser(true);
    setSelectedUser(null);
    setFormData({
      username: '',
      name: '',
      email: '',
      role: 'empleado',
      active: true
    });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setIsNewUser(false);
    setSelectedUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email || '',
      role: user.role,
      active: user.active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNewUser) {
      const newUser = userService.createUser(formData);
      toast({
        title: 'Usuario creado',
        description: `Usuario ${newUser.name} creado exitosamente`,
      });
    } else if (selectedUser) {
      const updatedUser = userService.updateUser(selectedUser.id, formData);
      if (updatedUser) {
        toast({
          title: 'Usuario actualizado',
          description: `Usuario ${updatedUser.name} actualizado exitosamente`,
        });
      }
    }
    
    loadUsers();
    setIsDialogOpen(false);
  };

  const handleToggleStatus = (user: User) => {
    const success = userService.toggleUserStatus(user.id);
    if (success) {
      toast({
        title: user.active ? 'Usuario desactivado' : 'Usuario activado',
        description: `${user.name} ha sido ${user.active ? 'desactivado' : 'activado'}`,
      });
      loadUsers();
    }
  };

  const handleDeleteUser = (user: User) => {
    const success = userService.deleteUser(user.id);
    if (success) {
      toast({
        title: 'Usuario eliminado',
        description: `${user.name} ha sido movido a extrabajadores`,
      });
      loadUsers();
    }
  };

  const handlePermanentDelete = (user: User) => {
    const success = userService.permanentlyDeleteUser(user.id);
    if (success) {
      toast({
        title: 'Usuario eliminado permanentemente',
        description: `${user.name} ha sido eliminado del sistema`,
      });
      loadUsers();
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      admin: { label: 'Administrador', className: 'bg-red-100 text-red-800' },
      almacen: { label: 'Almacén', className: 'bg-blue-100 text-blue-800' },
      empleado: { label: 'Empleado', className: 'bg-green-100 text-green-800' }
    };
    const config = roleConfig[role];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>
        <Button onClick={handleNewUser} className="bg-takab-600 hover:bg-takab-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Usuarios Activos */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Activos</CardTitle>
          <CardDescription>Gestiona los usuarios del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Extrabajadores */}
      <Card>
        <CardHeader>
          <CardTitle>Extrabajadores</CardTitle>
          <CardDescription>Usuarios que ya no forman parte del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inactiveUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handlePermanentDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para crear/editar usuario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewUser ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
            </DialogTitle>
            <DialogDescription>
              {isNewUser ? 'Completa los datos del nuevo usuario' : 'Modifica los datos del usuario'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="empleado">Empleado</option>
                <option value="almacen">Almacén</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked})}
              />
              <Label htmlFor="active">Usuario activo</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-takab-600 hover:bg-takab-700">
                {isNewUser ? 'Crear' : 'Actualizar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
