
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import UserManagement from '@/components/admin/UserManagement';

const UserManagementPage = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
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
    <Layout currentPage="Gestión de Usuarios">
      <UserManagement />
    </Layout>
  );
};

export default UserManagementPage;
