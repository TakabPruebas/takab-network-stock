
import { Product } from '@/types';

// Simulación de base de datos en memoria
let products: Product[] = [
  {
    id: 1,
    codigo: 'PROD001',
    nombre: 'Martillo',
    descripcion: 'Martillo de acero para construcción',
    proveedor_id: 1,
    categoria_id: 1,
    peso: 0.5,
    anchura: 10,
    profundidad: 25,
    alto: 5,
    unidad_medida: 'unidad',
    marca: 'Stanley',
    color: 'Negro',
    especificaciones: 'Mango ergonómico antideslizante',
    origen: 'China',
    costo_compra: 15.50,
    precio_venta: 25.00,
    stock_minimo: 10,
    stock_actual: 45,
    ubicacion: 'Almacén 1',
    estado: 'Nuevo',
    es_herramienta: true,
    fecha_creacion: '2024-01-15'
  },
  {
    id: 2,
    codigo: 'PROD002',
    nombre: 'Tornillos',
    descripcion: 'Tornillos de acero inoxidable 6x40mm',
    proveedor_id: 2,
    categoria_id: 2,
    peso: 0.01,
    unidad_medida: 'caja',
    marca: 'Hilti',
    color: 'Plateado',
    origen: 'Alemania',
    costo_compra: 12.00,
    precio_venta: 18.00,
    stock_minimo: 50,
    stock_actual: 120,
    ubicacion: 'Almacén 2',
    estado: 'Nuevo',
    es_herramienta: false,
    fecha_creacion: '2024-01-10'
  }
];

let nextId = 3;

export const productService = {
  // Obtener todos los productos
  getProducts: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...products]), 100);
    });
  },

  // Obtener producto por ID
  getProductById: async (id: number): Promise<Product | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = products.find(p => p.id === id);
        resolve(product || null);
      }, 100);
    });
  },

  // Crear nuevo producto
  createProduct: async (productData: Omit<Product, 'id' | 'fecha_creacion'>): Promise<Product> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          ...productData,
          id: nextId++,
          fecha_creacion: new Date().toISOString().split('T')[0]
        };
        products.push(newProduct);
        resolve(newProduct);
      }, 100);
    });
  },

  // Actualizar producto
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          products[index] = { ...products[index], ...productData };
          resolve(products[index]);
        } else {
          resolve(null);
        }
      }, 100);
    });
  },

  // Eliminar producto
  deleteProduct: async (id: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          products.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 100);
    });
  },

  // Buscar productos
  searchProducts: async (query: string): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredProducts = products.filter(product =>
          product.nombre.toLowerCase().includes(query.toLowerCase()) ||
          product.codigo?.toLowerCase().includes(query.toLowerCase()) ||
          product.descripcion?.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filteredProducts);
      }, 100);
    });
  }
};
