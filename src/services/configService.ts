import { Category, Supplier } from '@/types';

// Datos simulados para categorías
let categories: Category[] = [
  { id: 1, nombre: 'Herramientas Manuales', descripcion: 'Herramientas de uso manual' },
  { id: 2, nombre: 'Ferretería', descripcion: 'Tornillería y elementos de fijación' },
  { id: 3, nombre: 'Equipos Eléctricos', descripcion: 'Herramientas y equipos eléctricos' }
];

// Datos simulados para proveedores
let suppliers: Supplier[] = [
  { id: 1, nombre: 'Stanley Tools', contacto: 'Juan Pérez', telefono: '123-456-7890', email: 'ventas@stanley.com', direccion: 'Av. Industrial 123' },
  { id: 2, nombre: 'Hilti México', contacto: 'María García', telefono: '098-765-4321', email: 'mexico@hilti.com', direccion: 'Blvd. Tecnológico 456' }
];

// Datos simulados para almacenes
let warehouses = [
  { id: 1, nombre: 'Almacén Principal', ubicacion: 'Planta Baja', descripcion: 'Almacén principal de herramientas' },
  { id: 2, nombre: 'Almacén Secundario', ubicacion: 'Primer Piso', descripcion: 'Almacén de materiales consumibles' }
];

// Datos simulados para unidades de medida
let units = [
  { id: 1, nombre: 'Unidad', abreviacion: 'u', descripcion: 'Piezas individuales' },
  { id: 2, nombre: 'Caja', abreviacion: 'caja', descripcion: 'Cajas de producto' },
  { id: 3, nombre: 'Metro', abreviacion: 'm', descripcion: 'Metros lineales' },
  { id: 4, nombre: 'Kilogramo', abreviacion: 'kg', descripcion: 'Kilogramos' }
];

let nextCategoryId = 4;
let nextSupplierId = 3;
let nextWarehouseId = 3;
let nextUnitId = 5;

export const configService = {
  // CATEGORÍAS
  getCategories: async (): Promise<Category[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...categories]), 100);
    });
  },

  createCategory: async (data: Omit<Category, 'id'>): Promise<Category> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCategory: Category = { ...data, id: nextCategoryId++ };
        categories.push(newCategory);
        resolve(newCategory);
      }, 100);
    });
  },

  updateCategory: async (id: number, data: Partial<Category>): Promise<Category | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
          categories[index] = { ...categories[index], ...data };
          resolve(categories[index]);
        } else {
          resolve(null);
        }
      }, 100);
    });
  },

  deleteCategory: async (id: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
          categories.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 100);
    });
  },

  // PROVEEDORES
  getSuppliers: async (): Promise<Supplier[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...suppliers]), 100);
    });
  },

  createSupplier: async (data: Omit<Supplier, 'id'>): Promise<Supplier> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSupplier: Supplier = { ...data, id: nextSupplierId++ };
        suppliers.push(newSupplier);
        resolve(newSupplier);
      }, 100);
    });
  },

  updateSupplier: async (id: number, data: Partial<Supplier>): Promise<Supplier | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
          suppliers[index] = { ...suppliers[index], ...data };
          resolve(suppliers[index]);
        } else {
          resolve(null);
        }
      }, 100);
    });
  },

  deleteSupplier: async (id: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
          suppliers.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 100);
    });
  },

  // ALMACENES
  getWarehouses: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...warehouses]), 100);
    });
  },

  createWarehouse: async (data: Omit<typeof warehouses[0], 'id'>) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newWarehouse = { ...data, id: nextWarehouseId++ };
        warehouses.push(newWarehouse);
        resolve(newWarehouse);
      }, 100);
    });
  },

  updateWarehouse: async (id: number, data: Partial<typeof warehouses[0]>) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = warehouses.findIndex(w => w.id === id);
        if (index !== -1) {
          warehouses[index] = { ...warehouses[index], ...data };
          resolve(warehouses[index]);
        } else {
          resolve(null);
        }
      }, 100);
    });
  },

  deleteWarehouse: async (id: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = warehouses.findIndex(w => w.id === id);
        if (index !== -1) {
          warehouses.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 100);
    });
  },

  // UNIDADES DE MEDIDA
  getUnits: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...units]), 100);
    });
  },

  createUnit: async (data: Omit<typeof units[0], 'id'>) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUnit = { ...data, id: nextUnitId++ };
        units.push(newUnit);
        resolve(newUnit);
      }, 100);
    });
  },

  updateUnit: async (id: number, data: Partial<typeof units[0]>) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = units.findIndex(u => u.id === id);
        if (index !== -1) {
          units[index] = { ...units[index], ...data };
          resolve(units[index]);
        } else {
          resolve(null);
        }
      }, 100);
    });
  },

  deleteUnit: async (id: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = units.findIndex(u => u.id === id);
        if (index !== -1) {
          units.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 100);
    });
  }
};