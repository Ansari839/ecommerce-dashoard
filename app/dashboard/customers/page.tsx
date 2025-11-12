'use client';

import { useState } from 'react';
import { CustomerFilter } from '@/components/dashboard/CustomerFilter';
import { CustomerStats } from '@/components/dashboard/CustomerStats';
import { CustomersTable } from '@/components/dashboard/CustomersTable';

// Define the Customer type
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpend: number;
  status: 'active' | 'inactive' | 'vip';
}

export default function CustomersPage() {
  // Static sample customer data
  const [customers] = useState<Customer[]>([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1 (555) 123-4567', orders: 12, totalSpend: 2450.75, status: 'active' },
    { id: 2, name: 'Emma Johnson', email: 'emma@example.com', phone: '+1 (555) 234-5678', orders: 8, totalSpend: 1980.00, status: 'vip' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1 (555) 345-6789', orders: 3, totalSpend: 420.50, status: 'active' },
    { id: 4, name: 'Sarah Davis', email: 'sarah@example.com', phone: '+1 (555) 456-7890', orders: 0, totalSpend: 0.00, status: 'inactive' },
    { id: 5, name: 'Robert Wilson', email: 'robert@example.com', phone: '+1 (555) 567-8901', orders: 21, totalSpend: 5670.25, status: 'vip' },
    { id: 6, name: 'Jennifer Taylor', email: 'jennifer@example.com', phone: '+1 (555) 678-9012', orders: 5, totalSpend: 890.30, status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [customerType, setCustomerType] = useState('all');

  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active' || c.status === 'vip').length;
  const vipCustomers = customers.filter(c => c.status === 'vip').length;

  // Filter customers based on search term and type
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    if (customerType === 'all') return matchesSearch;
    if (customerType === 'active') return matchesSearch && customer.status !== 'inactive';
    if (customerType === 'inactive') return matchesSearch && customer.status === 'inactive';
    if (customerType === 'vip') return matchesSearch && customer.status === 'vip';
    
    return matchesSearch;
  });

  const handleViewCustomer = (customer: Customer) => {
    console.log('View customer:', customer);
    // In a real implementation, you would navigate to the customer details page
  };

  const handleMessageCustomer = (customer: Customer) => {
    console.log('Message customer:', customer);
    // In a real implementation, you would open a messaging interface
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Customers Management</h1>
        <p className="text-muted-foreground mt-1">Manage your customer base and interactions</p>
      </div>

      <CustomerFilter 
        searchTerm={searchTerm}
        customerType={customerType}
        onSearchChange={setSearchTerm}
        onTypeChange={setCustomerType}
      />

      <CustomerStats 
        totalCustomers={totalCustomers}
        activeCustomers={activeCustomers}
        vipCustomers={vipCustomers}
      />

      <CustomersTable 
        customers={filteredCustomers}
        onView={handleViewCustomer}
        onMessage={handleMessageCustomer}
      />
    </div>
  );
}