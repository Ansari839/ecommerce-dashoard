'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PurchaseTable } from '@/components/dashboard/PurchaseTable';
import { AddPurchaseModal } from '@/components/dashboard/AddPurchaseModal';
import { Plus } from 'lucide-react';

// Define the Purchase type
interface Purchase {
  id: string;
  supplier: string;
  totalAmount: number;
  date: string;
  status: 'draft' | 'ordered' | 'received';
}

export default function PurchasePage() {
  // Static sample purchase data
  const [purchases, setPurchases] = useState<Purchase[]>([
    { id: 'PO-1001', supplier: 'ABC Electronics', totalAmount: 12450.75, date: '2023-10-15', status: 'received' },
    { id: 'PO-1002', supplier: 'XYZ Supplies Co.', totalAmount: 8900.50, date: '2023-10-16', status: 'ordered' },
    { id: 'PO-1003', supplier: 'Global Trading Ltd.', totalAmount: 24500.00, date: '2023-10-17', status: 'draft' },
    { id: 'PO-1004', supplier: 'Tech Solutions Inc.', totalAmount: 5670.25, date: '2023-10-18', status: 'received' },
    { id: 'PO-1005', supplier: 'Office Essentials', totalAmount: 1890.99, date: '2023-10-19', status: 'ordered' },
    { id: 'PO-1006', supplier: 'Hardware Distributors', totalAmount: 7650.30, date: '2023-10-20', status: 'draft' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPurchase = (purchaseData: Purchase) => {
    setPurchases([purchaseData, ...purchases]);
  };

  const handleViewPurchase = (purchase: Purchase) => {
    console.log('View purchase:', purchase);
    // In a real implementation, you would navigate to the purchase details page
  };

  const handleEditPurchase = (purchase: Purchase) => {
    console.log('Edit purchase:', purchase);
    // In a real implementation, you would open an edit modal
  };

  const handleDeletePurchase = (id: string) => {
    setPurchases(purchases.filter(purchase => purchase.id !== id));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Purchase Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track your purchase orders</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Purchase
        </Button>
      </div>

      <PurchaseTable 
        purchases={purchases}
        onView={handleViewPurchase}
        onEdit={handleEditPurchase}
        onDelete={handleDeletePurchase}
      />

      <AddPurchaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPurchase}
      />
    </div>
  );
}