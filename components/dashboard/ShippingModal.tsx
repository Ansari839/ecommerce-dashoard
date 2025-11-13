'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

export interface Shipping {
  _id: string;
  shipmentId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  courier: 'FedEx' | 'DHL' | 'UPS';
  trackingNumber: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Returned';
  estimatedDelivery: string; // ISO date string
  actualDelivery?: string; // ISO date string
  shippingCost: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipping: Shipping | null;
  modalType: 'view' | 'updateStatus' | null;
  onUpdateStatus: (shipmentId: string, newStatus: string) => void;
  onDeleteShipping: (shipmentId: string) => void;
}

export function ShippingModal({ 
  isOpen, 
  onClose, 
  shipping, 
  modalType,
  onUpdateStatus,
  onDeleteShipping
}: ShippingModalProps) {
  const [newStatus, setNewStatus] = useState(shipping?.status || '');
  const [isConfirming, setIsConfirming] = useState(false);

  // Reset status when modal changes or shipping changes
  useState(() => {
    if (shipping) {
      setNewStatus(shipping.status);
    }
  });

  if (!isOpen || !shipping || !modalType) return null;

  const handleStatusUpdate = () => {
    onUpdateStatus(shipping._id, newStatus);
    setIsConfirming(false);
    onClose();
  };

  const handleDelete = () => {
    onDeleteShipping(shipping._id);
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
              ? 'Shipment Details' 
              : modalType === 'updateStatus' 
                ? 'Update Shipment Status' 
                : 'Delete Shipment'}
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
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Shipment ID</p>
                    <p className="text-gray-900 dark:text-white">#{shipping.shipmentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="text-gray-900 dark:text-white">#{shipping.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                    <p className="text-gray-900 dark:text-white">{shipping.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Courier</p>
                    <p className="text-gray-900 dark:text-white">{shipping.courier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
                    <p className="text-gray-900 dark:text-white">{shipping.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shipping.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      shipping.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      shipping.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {shipping.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Cost</p>
                    <p className="text-gray-900 dark:text-white">${shipping.shippingCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(shipping.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping Address</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-900 dark:text-white">{shipping.address.street}</p>
                  <p className="text-gray-900 dark:text-white">
                    {shipping.address.city}, {shipping.address.state} {shipping.address.zipCode}
                  </p>
                  <p className="text-gray-900 dark:text-white">{shipping.address.country}</p>
                </div>
              </div>

              {shipping.weight && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Package Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                      <p className="text-gray-900 dark:text-white">{shipping.weight} kg</p>
                    </div>
                    {shipping.dimensions && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Length</p>
                          <p className="text-gray-900 dark:text-white">{shipping.dimensions.length} cm</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Width</p>
                          <p className="text-gray-900 dark:text-white">{shipping.dimensions.width} cm</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Height</p>
                          <p className="text-gray-900 dark:text-white">{shipping.dimensions.height} cm</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {modalType === 'updateStatus' && (
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Update Shipment Status</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Change the status for shipment <span className="font-semibold">#{shipping.shipmentId}</span>
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Status: {shipping.status}
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Shipment ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">#{shipping.shipmentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Order ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">#{shipping.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Customer:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{shipping.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Courier:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{shipping.courier}</span>
                </div>
              </div>
            </div>
          )}

          {modalType === 'delete' && (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete shipment <span className="font-semibold">#{shipping.shipmentId}</span>? 
                This action cannot be undone.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                The shipment record will be permanently removed from the system.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-6 border-t dark:border-gray-700">
          {modalType === 'view' ? (
            <div className="space-x-2">
              <Button 
                onClick={() => {
                  // Update status action
                  setNewStatus(shipping.status);
                }}
                variant="outline"
                className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>
              <Button 
                onClick={() => {
                  // Delete action
                  onDeleteShipping(shipping._id);
                  onClose();
                }}
                variant="outline"
                className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          ) : modalType === 'updateStatus' ? (
            <div className="space-x-2">
              <Button 
                onClick={onClose}
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

          {modalType !== 'updateStatus' && modalType !== 'delete' && (
            <Button onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}