import { Button } from '@/components/ui/button';

interface Transaction {
  id: string;
  transactionId: string;
  order: {
    id: string;
  };
  customer: {
    id: string;
    name: string;
  };
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  method: 'Card' | 'COD' | 'Wallet';
  date: string; // ISO date string
}

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onConfirmRefund: (transactionId: string, reason: string) => void;
}

export function RefundModal({ isOpen, onClose, transaction, onConfirmRefund }: RefundModalProps) {
  if (!isOpen || !transaction) return null;

  const [reason, setReason] = React.useState('');

  const handleConfirm = () => {
    onConfirmRefund(transaction.id, reason);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Process Refund
          </h3>
          
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500 dark:text-gray-300">Transaction ID:</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.transactionId}</div>
              
              <div className="text-sm text-gray-500 dark:text-gray-300">Customer:</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.customer.name}</div>
              
              <div className="text-sm text-gray-500 dark:text-gray-300">Amount:</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">${transaction.amount.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Refund Reason
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              rows={3}
              placeholder="Enter reason for refund..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Refund
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to import React at the top level
// Since the component is being exported, I need to import React
import React from 'react';