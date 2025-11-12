import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (campaignData: any) => void;
}

export function AddCampaignModal({ isOpen, onClose, onAdd }: AddCampaignModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('discount');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [discount, setDiscount] = useState('');
  const [status, setStatus] = useState('active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.floor(Math.random() * 10000), // Generate a random ID
      name,
      type,
      startDate,
      endDate,
      discount: parseFloat(discount),
      status,
    });
    // Reset form fields
    setName('');
    setType('discount');
    setStartDate('');
    setEndDate('');
    setDiscount('');
    setStatus('active');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Campaign</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Campaign Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="loyalty">Loyalty Program</SelectItem>
                  <SelectItem value="email">Email Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="discount">Discount %</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                required
                className="mt-1"
                min="0"
                max="100"
                step="0.1"
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