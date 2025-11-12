'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentTable } from '@/components/dashboard/PaymentTable';
import { AddPaymentModal } from '@/components/dashboard/AddPaymentModal';
import { Plus } from 'lucide-react';

// Define the PaymentMethod type
interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  createdDate: string;
  gateway?: string;
}

export default function PaymentsPage() {
  // Static sample payment method data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 1, name: 'Business Credit Card', type: 'Credit Card', status: 'active', createdDate: '2023-01-15', gateway: 'Stripe' },
    { id: 2, name: 'Company PayPal', type: 'PayPal', status: 'active', createdDate: '2023-02-20', gateway: 'PayPal' },
    { id: 3, name: 'Bank Transfer Account', type: 'Bank Transfer', status: 'inactive', createdDate: '2023-03-10', gateway: 'Other' },
    { id: 4, name: 'Corporate Debit', type: 'Debit Card', status: 'active', createdDate: '2023-04-05', gateway: 'Stripe' },
    { id: 5, name: 'Digital Wallet', type: 'Digital Wallet', status: 'active', createdDate: '2023-05-12', gateway: 'Square' },
    { id: 6, name: 'Backup Payment', type: 'Credit Card', status: 'inactive', createdDate: '2023-06-18', gateway: 'PayPal' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPayment = (paymentData: PaymentMethod) => {
    setPaymentMethods([paymentData, ...paymentMethods]);
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    console.log('Edit payment method:', payment);
    // In a real implementation, you would open the modal with the payment data
  };

  const handleDeletePayment = (id: number) => {
    setPaymentMethods(paymentMethods.filter(payment => payment.id !== id));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Payments Management</h1>
          <p className="text-muted-foreground mt-1">Manage your payment methods and gateways</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      <PaymentTable 
        payments={paymentMethods}
        onEdit={handleEditPayment}
        onDelete={handleDeletePayment}
      />

      <AddPaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPayment}
      />
    </div>
  );
}