import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (shippingData: any) => void;
}

export function AddShippingModal({ isOpen, onClose, onAdd }: AddShippingModalProps) {
  const [name, setName] = useState('');
  const [courier, setCourier] = useState('fedex');
  const [rate, setRate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('3-5 business days');
  const [status, setStatus] = useState('active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.floor(Math.random() * 10000), // Generate a random ID
      name,
      courier,
      rate: parseFloat(rate),
      deliveryTime,
      status,
    });
    // Reset form fields
    setName('');
    setCourier('fedex');
    setRate('');
    setDeliveryTime('3-5 business days');
    setStatus('active');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Shipping Zone</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Zone Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
                placeholder="e.g. North America"
              />
            </div>
            
            <div>
              <Label htmlFor="courier">Courier</Label>
              <Select value={courier} onValueChange={setCourier}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                  <SelectItem value="amazon">Amazon Logistics</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="rate">Rate ($)</Label>
              <Input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                required
                className="mt-1"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="deliveryTime">Estimated Delivery Time</Label>
              <Input
                id="deliveryTime"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                required
                className="mt-1"
                placeholder="e.g. 3-5 business days"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}