'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, DollarSign, Trash2 } from 'lucide-react';

export interface Payment {
  _id: string;
  paymentId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: 'Card' | 'COD' | 'Wallet';
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  transactionId?: string;
  date: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  modalType: 'view' | 'refund' | null;
  onRefundPayment: (paymentId: string) => void;
  onDeletePayment: (paymentId: string) => void;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  payment, 
  modalType,
  onRefundPayment,
  onDeletePayment
}: PaymentModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen || !payment || !modalType) return null;

  const handleRefund = () => {
    onRefundPayment(payment._id);
    setIsConfirming(false);
    onClose();
  };

  const handleDelete = () => {
    onDeletePayment(payment._id);
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
              ? 'Payment Details' 
              : modalType === 'refund' 
                ? 'Refund Payment' 
                : 'Delete Payment'}
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
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment ID</p>
                    <p className="text-gray-900 dark:text-white">#{payment.paymentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="text-gray-900 dark:text-white">#{payment.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                    <p className="text-gray-900 dark:text-white">{payment.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="text-gray-900 dark:text-white">${payment.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Method</p>
                    <p className="text-gray-900 dark:text-white">{payment.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      payment.status === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                    <p className="text-gray-900 dark:text-white">{payment.transactionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {modalType === 'refund' && (
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Refund Payment</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Are you sure you want to refund this payment? This action cannot be undone.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Payment ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">#{payment.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${payment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Customer:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{payment.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Order ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">#{payment.orderId}</span>
                </div>
              </div>
            </div>
          )}

          {modalType === 'delete' && (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete payment <span className="font-semibold">#{payment.paymentId}</span>? 
                This action cannot be undone.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                The payment record will be permanently removed from the system.
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
                  // Refund action
                  setIsConfirming(true);
                }}
                variant="outline"
                className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Refund
              </Button>
              <Button 
                onClick={() => {
                  // Delete action
                  onDeletePayment(payment._id);
                  onClose();
                }}
                variant="outline"
                className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          ) : modalType === 'refund' ? (
            <div className="space-x-2">
              <Button 
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRefund}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirm Refund
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

          {modalType !== 'refund' && modalType !== 'delete' && (
            <Button onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}