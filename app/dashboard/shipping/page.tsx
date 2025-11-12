'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShippingTable } from '@/components/dashboard/ShippingTable';
import { AddShippingModal } from '@/components/dashboard/AddShippingModal';
import { Plus } from 'lucide-react';

// Define the ShippingZone type
interface ShippingZone {
  id: number;
  name: string;
  courier: string;
  rate: number;
  deliveryTime: string;
  status: 'active' | 'inactive';
}

export default function ShippingPage() {
  // Static sample shipping zone data
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
    { id: 1, name: 'North America', courier: 'FedEx', rate: 12.99, deliveryTime: '3-5 business days', status: 'active' },
    { id: 2, name: 'Europe', courier: 'DHL', rate: 18.50, deliveryTime: '5-7 business days', status: 'active' },
    { id: 3, name: 'Asia', courier: 'UPS', rate: 15.75, deliveryTime: '7-10 business days', status: 'inactive' },
    { id: 4, name: 'Australia', courier: 'USPS', rate: 22.30, deliveryTime: '10-14 business days', status: 'active' },
    { id: 5, name: 'South America', courier: 'Other', rate: 20.00, deliveryTime: '10-15 business days', status: 'active' },
    { id: 6, name: 'Africa', courier: 'DHL', rate: 25.00, deliveryTime: '14-20 business days', status: 'inactive' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddShipping = (shippingData: ShippingZone) => {
    setShippingZones([shippingData, ...shippingZones]);
  };

  const handleEditShipping = (shipping: ShippingZone) => {
    console.log('Edit shipping zone:', shipping);
    // In a real implementation, you would open the modal with the shipping data
  };

  const handleDeleteShipping = (id: number) => {
    setShippingZones(shippingZones.filter(shipping => shipping.id !== id));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Shipping Management</h1>
          <p className="text-muted-foreground mt-1">Manage your shipping zones and courier services</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Shipping Zone
        </Button>
      </div>

      <ShippingTable 
        shippingZones={shippingZones}
        onEdit={handleEditShipping}
        onDelete={handleDeleteShipping}
      />

      <AddShippingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddShipping}
      />
    </div>
  );
}