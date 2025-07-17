
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductManagement from '@/components/products/ProductManagement';

const ProductsPage: React.FC = () => {
  return (
    <Layout currentPage="Productos">
      <ProductManagement />
    </Layout>
  );
};

export default ProductsPage;
