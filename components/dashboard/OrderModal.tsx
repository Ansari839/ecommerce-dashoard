'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  products: OrderProduct[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  date: string; // ISO date string
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  onCancelOrder: (orderId: string) => void;
}

export function OrderModal({ 
  isOpen, 
  onClose, 
  order, 
  onUpdateStatus, 
  onCancelOrder 
}: OrderModalProps) {
  const [status, setStatus] = useState(order?.status || '');
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'cancel'>('view');

  if (!isOpen || !order) return null;

  const handleStatusUpdate = () => {
    if (order) {
      onUpdateStatus(order._id, status);
      setModalType('view');
    }
  };

  const handleCancelOrder = () => {
    if (order) {
      onCancelOrder(order._id);
      setModalType('view');
      setIsCancelConfirmOpen(false);
      onClose();
    }
  };

  // Reset status when modal changes to edit
  if (modalType === 'edit' && status !== order.status) {
    setStatus(order.status);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {modalType === 'view' 
              ? 'Order Details' 
              : modalType === 'edit' 
                ? 'Edit Order Status' 
                : 'Cancel Order'}
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                    <p className="text-gray-900 dark:text-white">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="text-gray-900 dark:text-white">#{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Products</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {order.products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${product.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            ${(product.price * product.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {modalType === 'edit' && (
            <div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
            </div>
          )}

          {modalType === 'cancel' && (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to cancel order <span className="font-semibold">#{order.orderId}</span>? 
                This action cannot be undone.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                The customer will be notified of the cancellation and any refund will be processed according to your refund policy.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-6 border-t dark:border-gray-700">
          {modalType === 'view' ? (
            <div className="space-x-2">
              <Button 
                onClick={() => setModalType('edit')}
                variant="outline"
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Status
              </Button>
              <Button 
                onClick={() => setIsCancelConfirmOpen(true)}
                variant="outline"
                className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cancel/Refund
              </Button>
            </div>
          ) : modalType === 'edit' ? (
            <div className="space-x-2">
              <Button 
                onClick={() => setModalType('view')}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate}
              >
                Update Status
              </Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Button 
                onClick={() => setIsCancelConfirmOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCancelOrder}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Cancellation
              </Button>
            </div>
          )}

          {modalType === 'view' && (
            <Button onClick={onClose}>
              Close
            </Button>
          )}
        </div>

        {/* Confirmation Modal for Cancel */}
        {isCancelConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Confirm Cancellation
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button 
                    onClick={() => setIsCancelConfirmOpen(false)}
                    variant="outline"
                  >
                    No, Keep Order
                  </Button>
                  <Button 
                    onClick={() => setModalType('cancel')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, Cancel Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}