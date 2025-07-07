
import { productOperations } from '@/lib/database';
import { Product } from '@/types';

export const productService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      return productOperations.getAllProducts();
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  },

  // Get products with low stock
  getLowStockProducts: async (): Promise<Product[]> => {
    try {
      return productOperations.getLowStockProducts();
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      return [];
    }
  },

  // Create new product
  createProduct: async (productData: Omit<Product, 'id' | 'fecha_creacion'>): Promise<boolean> => {
    try {
      return productOperations.createProduct(productData);
    } catch (error) {
      console.error('Error al crear producto:', error);
      return false;
    }
  }
};
