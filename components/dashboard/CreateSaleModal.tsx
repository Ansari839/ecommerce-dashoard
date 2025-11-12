import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (saleData: any) => void;
}

export function CreateSaleModal({ isOpen, onClose, onCreate }: CreateSaleModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`, // Generate a random order ID
      customerName,
      totalAmount: parseFloat(totalAmount),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
    setCustomerName('');
    setTotalAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create New Sale</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="totalAmount">Total Amount ($)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
                className="mt-1"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Sale</Button>
          </div>
        </form>
      </div>
    </div>
  );
}