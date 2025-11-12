import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (purchaseData: any) => void;
}

export function AddPurchaseModal({ isOpen, onClose, onAdd }: AddPurchaseModalProps) {
  const [supplier, setSupplier] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `PO-${Math.floor(100000 + Math.random() * 900000)}`, // Generate a random PO number
      supplier,
      totalAmount: parseFloat(totalAmount),
      date: new Date().toISOString().split('T')[0],
      status: 'draft'
    });
    setSupplier('');
    setTotalAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Purchase</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
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
            <Button type="submit">Add Purchase</Button>
          </div>
        </form>
      </div>
    </div>
  );
}