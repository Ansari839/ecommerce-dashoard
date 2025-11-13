'use client';

import { useState, useEffect } from 'react';
import { CustomersSearch } from '@/components/dashboard/CustomersSearch';
import { CustomersTable } from '@/components/dashboard/CustomersTable';
import { CustomerModal, Customer } from '@/components/dashboard/CustomerModal';

const CustomersPage = () => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalCustomers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);
  
  // State for modals
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger data refresh

  // Current page state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch customers from the API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (statusFilter) queryParams.append('status', statusFilter);
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '10');
        
        const response = await fetch(`/api/customers?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        
        const data = await response.json();
        setCustomers(data.data.customers || []);
        setPagination(data.data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [searchTerm, statusFilter, currentPage, refreshTrigger]);

  // Handle customer update
  const handleUpdateCustomer = async (customerId: string, data: Partial<Customer>) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      // Refresh the customers list
      setRefreshTrigger(prev => prev + 1);
      setModalType(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating customer:', err);
    }
  };

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      // Refresh the customers list
      setRefreshTrigger(prev => prev + 1);
      setModalType(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error deleting customer:', err);
    }
  };

  // Open the view details modal
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalType('view');
  };

  // Open the edit customer modal
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalType('edit');
  };

  // Open the delete customer modal
  const handleDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalType('delete');
  };

  // Handle save from any modal (for switching to edit from view modal)
  const handleSave = () => {
    if (selectedCustomer) {
      setModalType('edit');
    }
  };

  // Close the modal
  const closeModal = () => {
    setModalType(null);
    setSelectedCustomer(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Customers Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track customer information</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <CustomersSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <CustomersTable
          customers={customers}
          loading={loading}
          error={error}
          onViewDetails={handleViewDetails}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteModal}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {selectedCustomer && modalType && (
        <CustomerModal
          isOpen={!!modalType}
          onClose={closeModal}
          customer={selectedCustomer}
          modalType={modalType}
          onUpdateCustomer={handleUpdateCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CustomersPage;