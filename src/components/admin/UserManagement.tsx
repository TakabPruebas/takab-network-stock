
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, UserRole } from '@/types';
import { UserPlus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data para desarrollo - en producción esto vendría de SQLite
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Administrador TAKAB',
    role: 'admin',
    active: true,
    email: 'admin@takab.com',
    created_at: '2024-01-01'
  },
  {
    id: 2,
    username: 'almacen',
    name: 'Empleado de Almacén',
    role: 'almacen',
    active: true,
    email: 'almacen@takab.com',
    created_at: '2024-01-01'
  },
  {
    id: 3,
    username: 'empleado',
    name: 'Juan Pérez',
    role: 'empleado',
    active: true,
    email: 'juan.perez@takab.com',
    created_at: '2024-01-01'
  },
  {
    id: 4,
    username: 'maria.lopez',
    name: 'María López',
    role: 'empleado',
    active: false,
    email: 'maria.lopez@takab.com',
    created_at: '2024-01-02'
  }
];

interface UserFormData {
  username: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    name: '',
    email: '',
    role: 'empleado',
    password: ''
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      email: '',
      role: 'empleado',
      password: ''
    });
    setEditingUser(null);
  };

  const handleCreateUser = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email || '',
      role: user.role,
      password: ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.name || !formData.role) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    if (!editingUser && !formData.password) {
      toast({
        title: 'Error',
        description: 'La contraseña es obligatoria para nuevos usuarios',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingUser) {
        // Actualizar usuario existente
        const updatedUsers = users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...formData, updated_at: new Date().toISOString() }
            : user
        );
        setUsers(updatedUsers);
        toast({
          title: 'Usuario actualizado',
          description: `El usuario ${formData.name} ha sido actualizado correctamente`,
        });
      } else {
        // Crear nuevo usuario
        const newUser: User = {
          id: Math.max(...users.map(u => u.id)) + 1,
          username: formData.username,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          active: true,
          created_at: new Date().toISOString(),
        };
        setUsers([...users, newUser]);
        toast({
          title: 'Usuario creado',
          description: `El usuario ${formData.name} ha sido creado correctamente`,
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al guardar el usuario',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, active: !user.active, updated_at: new Date().toISOString() }
        : user
    );
    setUsers(updatedUsers);
    
    const user = users.find(u => u.id === userId);
    toast({
      title: user?.active ? 'Usuario desactivado' : 'Usuario activado',
      description: `El usuario ${user?.name} ha sido ${user?.active ? 'desactivado' : 'activado'}`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'admin') {
      toast({
        title: 'Error',
        description: 'No se puede eliminar un usuario administrador',
        variant: 'destructive',
      });
      return;
    }

    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    toast({
      title: 'Usuario eliminado',
      description: `El usuario ${user?.name} ha sido eliminado`,
    });
  };

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      'admin': 'bg-red-100 text-red-800',
      'almacen': 'bg-blue-100 text-blue-800',
      'empleado': 'bg-green-100 text-green-800',
    };
    
    const labels = {
      'admin': 'Administrador',
      'almacen': 'Almacén',
      'empleado': 'Empleado',
    };

    return (
      <Badge className={variants[role]}>
        {labels[role]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administra los usuarios del sistema TAKAB</p>
        </div>
        <Button onClick={handleCreateUser} className="bg-takab-600 hover:bg-takab-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            Gestiona los permisos y accesos de los usuarios del sistema
          </CardDescription>
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
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge className={user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('es-MX') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.active ? 
                          <ToggleRight className="h-4 w-4 text-green-600" /> :
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        }
                      </Button>
                      {user.role !== 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Modifica los datos del usuario seleccionado'
                : 'Completa los datos para crear un nuevo usuario'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Usuario *
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="col-span-3"
                placeholder="nombre.usuario"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
                placeholder="Nombre completo"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="col-span-3"
                placeholder="usuario@takab.com"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rol *
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: UserRole) => setFormData({...formData, role: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empleado">Empleado</SelectItem>
                  <SelectItem value="almacen">Almacén</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                {editingUser ? 'Nueva Contraseña' : 'Contraseña *'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="col-span-3"
                placeholder={editingUser ? 'Dejar vacío para mantener actual' : 'Contraseña'}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-takab-600 hover:bg-takab-700">
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
