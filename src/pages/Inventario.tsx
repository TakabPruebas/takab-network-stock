import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import InventarioManagement from '@/components/inventario/InventarioManagement';

const InventarioPage = () => {
  const { user } = useAuth();

  if (user?.role === 'empleado') {
    return (
      <Layout currentPage="Acceso Denegado">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600">Acceso Denegado</h2>
          <p className="mt-2 text-gray-600">No tienes permisos para acceder a esta página</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="Inventario">
      <InventarioManagement userRole={user?.role || 'almacen'} />
    </Layout>
  );
};

export default InventarioPage;