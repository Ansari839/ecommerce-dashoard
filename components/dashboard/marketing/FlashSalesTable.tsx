'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';

export interface IFlashSale {
  _id: string;
  title: string;
  description?: string;
  productId: string;
  discountPercentage: number;
  salePrice: number;
  originalPrice: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'active' | 'upcoming' | 'expired';
  maxQuantity: number;
  remainingQuantity: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string;
}

interface FlashSalesTableProps {
  flashSales: IFlashSale[];
  loading: boolean;
  error: string | null;
  onEdit: (flashSale: IFlashSale) => void;
  onDelete: (flashSaleId: string) => void;
  onAddNew: () => void;
}

export function FlashSalesTable({ 
  flashSales, 
  loading, 
  error, 
  onEdit, 
  onDelete,
  onAddNew
}: FlashSalesTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'upcoming':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500 dark:text-gray-400">Loading flash sales...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Flash Sales</h2>
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Flash Sale
        </Button>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Discount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Validity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {flashSales.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No flash sales found
              </td>
            </tr>
          ) : (
            flashSales.map((flashSale) => (
              <tr key={flashSale._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {flashSale.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {flashSale.discountPercentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <span className="line-through text-gray-400 dark:text-gray-500">${flashSale.originalPrice.toFixed(2)}</span> 
                  <span className="ml-2 text-red-600 dark:text-red-400">${flashSale.salePrice.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(flashSale.startDate)} - {formatDate(flashSale.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant={getStatusVariant(flashSale.status)}>
                    {flashSale.status.charAt(0).toUpperCase() + flashSale.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {flashSale.remainingQuantity} / {flashSale.maxQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(flashSale)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(flashSale._id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}