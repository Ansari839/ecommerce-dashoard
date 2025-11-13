'use client';

import { useState, useEffect } from 'react';
import { ShippingSearch } from '@/components/dashboard/ShippingSearch';
import { ShippingTable } from '@/components/dashboard/ShippingTable';
import { ShippingModal, Shipping } from '@/components/dashboard/ShippingModal';

const ShippingPage = () => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courierFilter, setCourierFilter] = useState('');
  const [shipments, setShipments] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalShipments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);
  
  // State for modals
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(null);
  const [modalType, setModalType] = useState<'view' | 'updateStatus' | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger data refresh

  // Current page state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch shipments from the API
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (statusFilter) queryParams.append('status', statusFilter);
        if (courierFilter) queryParams.append('courier', courierFilter);
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '10');
        
        const response = await fetch(`/api/shipping?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shipments');
        }
        
        const data = await response.json();
        setShipments(data.data.shipments || []);
        setPagination(data.data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching shipments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [searchTerm, statusFilter, courierFilter, currentPage, refreshTrigger]);

  // Handle update shipment status
  const handleUpdateStatus = async (shipmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/shipping/${shipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update shipment status');
      }

      // Refresh the shipments list
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating shipment status:', err);
    }
  };

  // Handle delete shipment
  const handleDeleteShipping = async (shipmentId: string) => {
    try {
      const response = await fetch(`/api/shipping/${shipmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete shipment');
      }

      // Refresh the shipments list
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error deleting shipment:', err);
    }
  };

  // Open the view details modal
  const handleViewDetails = (shipping: Shipping) => {
    setSelectedShipping(shipping);
    setModalType('view');
  };

  // Open the update status modal
  const handleUpdateStatusModal = (shipping: Shipping) => {
    setSelectedShipping(shipping);
    setModalType('updateStatus');
  };

  // Close the modal
  const closeModal = () => {
    setModalType(null);
    setSelectedShipping(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Shipping Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track shipment fulfillments</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ShippingSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          courierFilter={courierFilter}
          onCourierFilterChange={setCourierFilter}
        />

        <ShippingTable
          shipments={shipments}
          loading={loading}
          error={error}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatusModal}
          onDeleteShipping={handleDeleteShipping}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {selectedShipping && modalType && (
        <ShippingModal
          isOpen={!!modalType}
          onClose={closeModal}
          shipping={selectedShipping}
          modalType={modalType}
          onUpdateStatus={handleUpdateStatus}
          onDeleteShipping={handleDeleteShipping}
        />
      )}
    </div>
  );
};

export default ShippingPage;