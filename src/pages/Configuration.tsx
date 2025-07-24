import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Package, Building, Ruler, Truck } from 'lucide-react';
import CategoryManagement from '@/components/config/CategoryManagement';
import SupplierManagement from '@/components/config/SupplierManagement';
import WarehouseManagement from '@/components/config/WarehouseManagement';
import UnitManagement from '@/components/config/UnitManagement';

type ConfigSection = 'overview' | 'categories' | 'suppliers' | 'warehouses' | 'units';

const Configuration: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ConfigSection>('overview');

  const configSections = [
    {
      id: 'categories' as ConfigSection,
      title: 'Categorías',
      description: 'Gestiona las categorías de productos',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      id: 'suppliers' as ConfigSection,
      title: 'Proveedores',
      description: 'Administra la información de proveedores',
      icon: Truck,
      color: 'text-green-600'
    },
    {
      id: 'warehouses' as ConfigSection,
      title: 'Almacenes',
      description: 'Configura los almacenes y ubicaciones',
      icon: Building,
      color: 'text-orange-600'
    },
    {
      id: 'units' as ConfigSection,
      title: 'Unidades de Medida',
      description: 'Define las unidades de medida',
      icon: Ruler,
      color: 'text-purple-600'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'categories':
        return <CategoryManagement />;
      case 'suppliers':
        return <SupplierManagement />;
      case 'warehouses':
        return <WarehouseManagement />;
      case 'units':
        return <UnitManagement />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Configuración del Sistema
              </h2>
              <p className="text-gray-600">
                Administra las configuraciones básicas del sistema de inventario
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {configSections.map((section) => (
                <Card
                  key={section.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection(section.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <section.icon className={`h-8 w-8 ${section.color}`} />
                      <span>{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{section.description}</p>
                    <Button variant="outline" className="mt-4 w-full">
                      Configurar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Administra las configuraciones del sistema</p>
        </div>
        {activeSection !== 'overview' && (
          <Button
            variant="outline"
            onClick={() => setActiveSection('overview')}
          >
            Volver a Configuración
          </Button>
        )}
      </div>

      {/* Navegación de pestañas cuando no estamos en overview */}
      {activeSection !== 'overview' && (
        <div className="border-b">
          <nav className="flex space-x-8">
            {configSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default Configuration;