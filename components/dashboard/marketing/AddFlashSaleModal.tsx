'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IFlashSale {
  _id?: string;
  title: string;
  description?: string;
  productId: string;
  discountPercentage: number;
  salePrice: number;
  originalPrice: number;
  startDate: string;
  endDate: string;
  status?: 'active' | 'upcoming' | 'expired';
  maxQuantity: number;
  remainingQuantity: number;
}

interface AddFlashSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashSale?: IFlashSale;
  onSave: (flashSale: IFlashSale) => void;
}

export function AddFlashSaleModal({ isOpen, onClose, flashSale, onSave }: AddFlashSaleModalProps) {
  const [formData, setFormData] = useState<IFlashSale>({
    _id: flashSale?._id || '',
    title: flashSale?.title || '',
    description: flashSale?.description || '',
    productId: flashSale?.productId || '',
    discountPercentage: flashSale?.discountPercentage || 0,
    salePrice: flashSale?.salePrice || 0,
    originalPrice: flashSale?.originalPrice || 0,
    startDate: flashSale?.startDate || new Date().toISOString().split('T')[0],
    endDate: flashSale?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default: 7 days from now
    status: flashSale?.status || 'upcoming',
    maxQuantity: flashSale?.maxQuantity || 10,
    remainingQuantity: flashSale?.remainingQuantity || flashSale?.maxQuantity || 10,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountPercentage' || name === 'salePrice' || 
               name === 'originalPrice' || name === 'maxQuantity' || 
               name === 'remainingQuantity' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountPercentage' || name === 'salePrice' || 
               name === 'originalPrice' || name === 'maxQuantity' || 
               name === 'remainingQuantity' ? Number(value) : value
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
            {flashSale ? 'Edit Flash Sale' : 'Add New Flash Sale'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter flash sale title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Enter flash sale description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                  placeholder="Enter product ID"
                />
              </div>
              <div>
                <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
                <Input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Enter discount percentage"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter original price"
                />
              </div>
              <div>
                <Label htmlFor="salePrice">Sale Price ($)</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter sale price"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxQuantity">Max Quantity</Label>
                <Input
                  id="maxQuantity"
                  name="maxQuantity"
                  type="number"
                  value={formData.maxQuantity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Enter max quantity"
                />
              </div>
              <div>
                <Label htmlFor="remainingQuantity">Remaining Quantity</Label>
                <Input
                  id="remainingQuantity"
                  name="remainingQuantity"
                  type="number"
                  value={formData.remainingQuantity}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Enter remaining quantity"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {flashSale ? 'Update' : 'Create'} Flash Sale
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}