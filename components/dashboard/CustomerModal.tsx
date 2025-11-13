'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface OrderHistory {
  id: string;
  date: string;
  total: number;
  status: string;
}

export interface Customer {
  _id: string;
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  status: 'Active' | 'Inactive' | 'VIP';
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  orderHistory?: OrderHistory[]; // For view modal only
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  modalType: 'view' | 'edit' | 'delete' | null;
  onUpdateCustomer: (customerId: string, data: Partial<Customer>) => void;
  onDeleteCustomer: (customerId: string) => void;
  onSave: () => void;
}

export function CustomerModal({ 
  isOpen, 
  onClose, 
  customer, 
  modalType,
  onUpdateCustomer,
  onDeleteCustomer,
  onSave
}: CustomerModalProps) {
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [status, setStatus] = useState(customer?.status || 'Active');

  // Reset form when modal changes or customer changes
  useState(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone || '');
      setStatus(customer.status);
    }
  });

  if (!isOpen || !customer || !modalType) return null;

  const handleSave = () => {
    onUpdateCustomer(customer._id, { name, email, phone, status });
    onSave();
  };

  const handleDelete = () => {
    onDeleteCustomer(customer._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {modalType === 'view' 
              ? 'Customer Details' 
              : modalType === 'edit' 
                ? 'Edit Customer' 
                : 'Delete Customer'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {modalType === 'view' && (
            <div>
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID</p>
                    <p className="text-gray-900 dark:text-white">#{customer.customerId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="text-gray-900 dark:text-white">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white">{customer.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      customer.status === 'Inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loyalty Points</p>
                    <p className="text-gray-900 dark:text-white">{customer.loyaltyPoints}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order History</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {customer.orderHistory && customer.orderHistory.length > 0 ? (
                        customer.orderHistory.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">#{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {new Date(order.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${order.total.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{customer.totalOrders}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">${customer.totalSpent.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loyalty Points</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{customer.loyaltyPoints}</p>
                </div>
              </div>
            </div>
          )}

          {modalType === 'edit' && (
            <div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive' | 'VIP')}
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {modalType === 'delete' && (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete customer <span className="font-semibold">{customer.name}</span>? 
                This action cannot be undone.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                All customer data, including order history and loyalty points, will be permanently removed.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-6 border-t dark:border-gray-700">
          {modalType === 'view' ? (
            <div className="space-x-2">
              <Button 
                onClick={() => onSave()}
                variant="outline"
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
            </div>
          ) : modalType === 'edit' ? (
            <div className="space-x-2">
              <Button 
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Button 
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Delete
              </Button>
            </div>
          )}

          {modalType !== 'edit' && modalType !== 'delete' && (
            <Button onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}