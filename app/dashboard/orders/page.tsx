'use client';

import { useState, useEffect } from 'react';
import { OrdersSearch } from '@/components/dashboard/OrdersSearch';
import { OrdersTable } from '@/components/dashboard/OrdersTable';
import { OrderModal, Order } from '@/components/dashboard/OrderModal';

const OrdersPage = () => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);
  
  // State for modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'cancel' | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger data refresh

  // Current page state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (statusFilter) queryParams.append('status', statusFilter);
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '10');
        
        const response = await fetch(`/api/orders?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data.data.orders || []);
        setPagination(data.data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchTerm, statusFilter, currentPage, refreshTrigger]);

  // Handle order status update
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh the orders list
      setRefreshTrigger(prev => prev + 1);
      setModalType(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating order status:', err);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      // Refresh the orders list
      setRefreshTrigger(prev => prev + 1);
      setModalType(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error canceling order:', err);
    }
  };

  // Open the view details modal
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setModalType('view');
  };

  // Open the edit status modal
  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setModalType('edit');
  };

  // Open the cancel order modal
  const handleCancelModal = (order: Order) => {
    setSelectedOrder(order);
    setModalType('cancel');
  };

  // Close the modal
  const closeModal = () => {
    setModalType(null);
    setSelectedOrder(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Orders Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track customer orders</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <OrdersSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <OrdersTable
          orders={orders}
          loading={loading}
          error={error}
          onViewDetails={handleViewDetails}
          onEditStatus={handleEditStatus}
          onCancelOrder={handleCancelModal}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {selectedOrder && modalType && (
        <OrderModal
          isOpen={!!modalType}
          onClose={closeModal}
          order={selectedOrder}
          onUpdateStatus={handleUpdateStatus}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default OrdersPage;