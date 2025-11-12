'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SalesTable } from '@/components/dashboard/SalesTable';
import { CreateSaleModal } from '@/components/dashboard/CreateSaleModal';
import { Plus } from 'lucide-react';

// Define the Sale type
interface Sale {
  id: string;
  customerName: string;
  totalAmount: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export default function SalesPage() {
  // Static sample sales data
  const [sales, setSales] = useState<Sale[]>([
    { id: 'ORD-1001', customerName: 'John Smith', totalAmount: 1245.75, date: '2023-10-15', status: 'completed' },
    { id: 'ORD-1002', customerName: 'Emma Johnson', totalAmount: 890.50, date: '2023-10-16', status: 'pending' },
    { id: 'ORD-1003', customerName: 'Michael Brown', totalAmount: 2450.00, date: '2023-10-17', status: 'completed' },
    { id: 'ORD-1004', customerName: 'Sarah Davis', totalAmount: 567.25, date: '2023-10-18', status: 'cancelled' },
    { id: 'ORD-1005', customerName: 'Robert Wilson', totalAmount: 1890.99, date: '2023-10-19', status: 'completed' },
    { id: 'ORD-1006', customerName: 'Jennifer Taylor', totalAmount: 765.30, date: '2023-10-20', status: 'pending' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateSale = (saleData: Sale) => {
    setSales([saleData, ...sales]);
  };

  const handleViewSale = (sale: Sale) => {
    console.log('View sale:', sale);
    // In a real implementation, you would navigate to the sale details page
  };

  const handleEditSale = (sale: Sale) => {
    console.log('Edit sale:', sale);
    // In a real implementation, you would open an edit modal
  };

  const handleDeleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Sales Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track your sales transactions</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Sale
        </Button>
      </div>

      <SalesTable 
        sales={sales}
        onView={handleViewSale}
        onEdit={handleEditSale}
        onDelete={handleDeleteSale}
      />

      <CreateSaleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSale}
      />
    </div>
  );
}