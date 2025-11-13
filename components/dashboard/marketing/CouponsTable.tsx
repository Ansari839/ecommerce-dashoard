'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';

export interface ICoupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minimumOrderAmount?: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  usageLimitPerUser?: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string;
}

interface CouponsTableProps {
  coupons: ICoupon[];
  loading: boolean;
  error: string | null;
  onEdit: (coupon: ICoupon) => void;
  onDelete: (couponId: string) => void;
  onAddNew: () => void;
}

export function CouponsTable({ 
  coupons, 
  loading, 
  error, 
  onEdit, 
  onDelete,
  onAddNew
}: CouponsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (coupon: ICoupon) => {
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (now < startDate) {
      return <Badge variant="secondary">Scheduled</Badge>;
    } else if (now >= startDate && now <= endDate) {
      return <Badge variant="default">Active</Badge>;
    } else {
      return <Badge variant="destructive">Expired</Badge>;
    }
  };

  const getDiscountValue = (coupon: ICoupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    } else {
      return `$${coupon.discountValue}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500 dark:text-gray-400">Loading coupons...</div>
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Discount Codes / Coupons</h2>
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Discount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Min Order</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Validity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usage</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {coupons.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No coupons found
              </td>
            </tr>
          ) : (
            coupons.map((coupon) => (
              <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {coupon.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {getDiscountValue(coupon)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {coupon.minimumOrderAmount ? `$${coupon.minimumOrderAmount}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(coupon)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {coupon.currentUses}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(coupon._id)}
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