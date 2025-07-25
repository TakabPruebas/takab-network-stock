import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import SolicitudesManagement from '@/components/solicitudes/SolicitudesManagement';

const SolicitudesPage = () => {
  const { user } = useAuth();

  return (
    <Layout currentPage="Solicitudes">
      <SolicitudesManagement userRole={user?.role || 'empleado'} />
    </Layout>
  );
};

export default SolicitudesPage;