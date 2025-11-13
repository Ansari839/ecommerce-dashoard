'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ICoupon {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minimumOrderAmount?: number;
  startDate: string;
  endDate: string;
  maxUses?: number;
  currentUses?: number;
  isActive?: boolean;
  usageLimitPerUser?: number;
}

interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon?: ICoupon;
  onSave: (coupon: ICoupon) => void;
}

export function AddCouponModal({ isOpen, onClose, coupon, onSave }: AddCouponModalProps) {
  const [formData, setFormData] = useState<ICoupon>({
    _id: coupon?._id || '',
    code: coupon?.code || '',
    discountType: coupon?.discountType || 'percentage',
    discountValue: coupon?.discountValue || 0,
    minimumOrderAmount: coupon?.minimumOrderAmount || 0,
    startDate: coupon?.startDate || new Date().toISOString().split('T')[0],
    endDate: coupon?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default: 7 days from now
    maxUses: coupon?.maxUses || 0,
    currentUses: coupon?.currentUses || 0,
    isActive: coupon?.isActive !== undefined ? coupon.isActive : true,
    usageLimitPerUser: coupon?.usageLimitPerUser || 1,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountValue' || name === 'minimumOrderAmount' || 
               name === 'maxUses' || name === 'usageLimitPerUser' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountValue' || name === 'minimumOrderAmount' || 
               name === 'maxUses' || name === 'usageLimitPerUser' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {coupon ? 'Edit Coupon' : 'Add New Coupon'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="Enter coupon code"
                />
              </div>
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value) => handleSelectChange('discountType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountValue">
                  Discount Value ({formData.discountType === 'percentage' ? '%' : '$'})
                </Label>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter discount value"
                />
              </div>
              <div>
                <Label htmlFor="minimumOrderAmount">Minimum Order Amount ($)</Label>
                <Input
                  id="minimumOrderAmount"
                  name="minimumOrderAmount"
                  type="number"
                  value={formData.minimumOrderAmount || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter minimum order amount"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate.split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate.split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maxUses">Max Uses (0 for unlimited)</Label>
                <Input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  value={formData.maxUses || 0}
                  onChange={handleChange}
                  min="0"
                  placeholder="Max uses"
                />
              </div>
              <div>
                <Label htmlFor="usageLimitPerUser">Limit Per User (0 for unlimited)</Label>
                <Input
                  id="usageLimitPerUser"
                  name="usageLimitPerUser"
                  type="number"
                  value={formData.usageLimitPerUser || 1}
                  onChange={handleChange}
                  min="0"
                  placeholder="Uses per user"
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {coupon ? 'Update' : 'Create'} Coupon
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}