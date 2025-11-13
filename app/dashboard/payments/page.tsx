'use client';

import { useState, useEffect } from 'react';
import { PaymentSummaryCard } from '@/components/dashboard/payments/PaymentSummaryCard';
import { TransactionTable } from '@/components/dashboard/payments/TransactionTable';
import { RefundModal } from '@/components/dashboard/payments/RefundModal';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

// Define the Transaction interface
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

export default function PaymentsPage() {
  // State for filters
  const [dateRange, setDateRange] = useState({
    start: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Last 30 days
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  
  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for summary data
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    pending: 0,
    failed: 0,
    refunded: 0
  });
  
  // State for refund modal
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, this would fetch from the API
        // For now, using mock data
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            transactionId: 'TXN001',
            order: { id: 'ORD001' },
            customer: { id: 'CUST001', name: 'John Doe' },
            amount: 125.99,
            status: 'Paid',
            method: 'Card',
            date: new Date().toISOString()
          },
          {
            id: '2',
            transactionId: 'TXN002',
            order: { id: 'ORD002' },
            customer: { id: 'CUST002', name: 'Jane Smith' },
            amount: 89.50,
            status: 'Pending',
            method: 'Wallet',
            date: new Date().toISOString()
          },
          {
            id: '3',
            transactionId: 'TXN003',
            order: { id: 'ORD003' },
            customer: { id: 'CUST003', name: 'Robert Johnson' },
            amount: 245.75,
            status: 'Failed',
            method: 'Card',
            date: new Date().toISOString()
          },
          {
            id: '4',
            transactionId: 'TXN004',
            order: { id: 'ORD004' },
            customer: { id: 'CUST004', name: 'Emily Davis' },
            amount: 78.25,
            status: 'Refunded',
            method: 'COD',
            date: new Date().toISOString()
          },
          {
            id: '5',
            transactionId: 'TXN005',
            order: { id: 'ORD005' },
            customer: { id: 'CUST005', name: 'Michael Brown' },
            amount: 199.99,
            status: 'Paid',
            method: 'Card',
            date: new Date().toISOString()
          }
        ];
        
        setTransactions(mockTransactions);
        
        // Calculate summary totals
        const totalRevenue = mockTransactions
          .filter(t => t.status === 'Paid' || t.status === 'Refunded')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const pending = mockTransactions.filter(t => t.status === 'Pending').length;
        const failed = mockTransactions.filter(t => t.status === 'Failed').length;
        const refunded = mockTransactions
          .filter(t => t.status === 'Refunded')
          .reduce((sum, t) => sum + t.amount, 0);
          
        setSummary({
          totalRevenue,
          pending,
          failed,
          refunded
        });
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [dateRange, statusFilter, methodFilter]);

  // Handle refund initiation
  const handleInitiateRefund = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsRefundModalOpen(true);
  };

  // Handle refund confirmation
  const handleConfirmRefund = async (transactionId: string, reason: string) => {
    try {
      // In a real app, this would call the refund API
      console.log('Processing refund for transaction:', transactionId, 'reason:', reason);
      
      // Update transaction status locally (in a real app, reload from API)
      setTransactions(transactions.map(tx => 
        tx.id === transactionId ? {...tx, status: 'Refunded'} : tx
      ));
      
      // Update summary
      setSummary(prev => ({
        ...prev,
        refunded: prev.refunded + (transactions.find(t => t.id === transactionId)?.amount || 0),
        totalRevenue: prev.totalRevenue - (transactions.find(t => t.id === transactionId)?.amount || 0)
      }));
    } catch (err) {
      setError('Failed to process refund');
      console.error('Error processing refund:', err);
    }
  };

  // View transaction details
  const handleViewDetails = (transaction: Transaction) => {
    console.log('Viewing transaction details:', transaction);
    // In a real app, this would open a details modal or navigate to a detail page
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Payments & Transactions</h1>
          <p className="text-muted-foreground mt-1">View and manage payment transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <Input
            type="date"
            id="startDate"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <Input
            type="date"
            id="endDate"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Status
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="methodFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Method
          </label>
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="COD">COD</SelectItem>
              <SelectItem value="Wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <PaymentSummaryCard 
        totalRevenue={summary.totalRevenue}
        pending={summary.pending}
        failed={summary.failed}
        refunded={summary.refunded}
      />

      {/* Transaction Table */}
      <TransactionTable 
        transactions={transactions}
        loading={loading}
        error={error}
        onRefund={handleInitiateRefund}
        onViewDetails={handleViewDetails}
      />

      {/* Refund Modal */}
      {selectedTransaction && (
        <RefundModal
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          transaction={selectedTransaction}
          onConfirmRefund={handleConfirmRefund}
        />
      )}
    </div>
  );
}