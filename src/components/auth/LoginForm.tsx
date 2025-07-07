
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, User } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa usuario y contraseña',
        variant: 'destructive',
      });
      return;
    }

    const success = await login(username, password);
    
    if (!success) {
      toast({
        title: 'Error de autenticación',
        description: 'Usuario o contraseña incorrectos',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center takab-gradient p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center mb-4 electric-glow">
            <span className="text-2xl font-bold text-takab-900">T</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">TAKAB</h1>
          <p className="text-takab-300 text-lg">Sistema de Inventario</p>
          <p className="text-takab-400 text-sm">Instalación Eléctrica y Redes</p>
        </div>

        {/* Formulario de login */}
        <Card className="takab-card border-takab-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-takab-300">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-takab-300">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-takab-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-takab-800 border-takab-600 text-white placeholder-takab-400"
                    placeholder="Ingresa tu usuario"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-takab-300">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-takab-800 border-takab-600 text-white placeholder-takab-400"
                  placeholder="Ingresa tu contraseña"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-takab-500 hover:bg-takab-400 text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verificando...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Información de usuarios de prueba */}
            <div className="mt-6 p-4 bg-takab-800 rounded-lg border border-takab-600">
              <p className="text-takab-300 text-sm font-medium mb-2">Usuarios de prueba:</p>
              <div className="space-y-1 text-xs text-takab-400">
                <div>Admin: admin / admin123</div>
                <div>Almacén: almacen / almacen123</div>
                <div>Empleado: empleado / empleado123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
