'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { SalesCard } from '@/components/dashboard/reports/SalesCard';
import { TopProductsChart } from '@/components/dashboard/reports/TopProductsChart';
import { CustomersChart } from '@/components/dashboard/reports/CustomersChart';
import { InventoryChart } from '@/components/dashboard/reports/InventoryChart';
import { PaymentsChart } from '@/components/dashboard/reports/PaymentsChart';
import { ShippingChart } from '@/components/dashboard/reports/ShippingChart';
import { RefundsChart } from '@/components/dashboard/reports/RefundsChart';

export default function ReportsPage() {
  // Filter states
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    end: new Date()
  });
  const [category, setCategory] = useState<string>('all');

  // Data states
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    newCustomers: 0
  });
  const [revenueOverTime, setRevenueOverTime] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState({
    customerCount: 0,
    avgOrderCount: 0,
    avgTotalSpent: 0,
    totalRevenue: 0,
    newCustomers: 0,
    returningCustomers: 0
  });
  const [inventoryData, setInventoryData] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: [],
    lowStockCount: 0
  });
  const [paymentData, setPaymentData] = useState({
    paymentDistribution: [],
    statusCounts: []
  });
  const [shippingData, setShippingData] = useState({
    shippingData: [],
    pendingShipments: 0
  });
  const [refundData, setRefundData] = useState({
    totalRefunds: 0,
    totalRefundAmount: 0,
    avgRefundAmount: 0
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Format dates for API
      const startDate = dateRange.start ? format(dateRange.start, 'yyyy-MM-dd') : undefined;
      const endDate = dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : undefined;

      // Fetch sales data
      const salesResponse = await fetch(
        `/api/reports?type=sales${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}${category !== 'all' ? `&category=${category}` : ''}`
      );
      if (!salesResponse.ok) throw new Error('Failed to fetch sales data');
      const salesResult = await salesResponse.json();
      if (salesResult.success) {
        setSalesData({
          totalRevenue: salesResult.data.totalRevenue || 0,
          totalOrders: salesResult.data.totalOrders || 0,
          avgOrderValue: salesResult.data.avgOrderValue || 0,
          newCustomers: salesResult.data.newCustomers || 0
        });
      }

      // Fetch revenue over time
      const revenueResponse = await fetch(
        `/api/reports?type=revenue-over-time${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}${category !== 'all' ? `&category=${category}` : ''}`
      );
      if (!revenueResponse.ok) throw new Error('Failed to fetch revenue over time');
      const revenueResult = await revenueResponse.json();
      if (revenueResult.success) {
        setRevenueOverTime(revenueResult.data);
      }

      // Fetch top products
      const productsResponse = await fetch(
        `/api/reports?type=top-products${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}${category !== 'all' ? `&category=${category}` : ''}`
      );
      if (!productsResponse.ok) throw new Error('Failed to fetch top products');
      const productsResult = await productsResponse.json();
      if (productsResult.success) {
        setTopProducts(productsResult.data);
      }

      // Fetch customer data
      const customerResponse = await fetch(
        `/api/reports?type=customers${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`
      );
      if (!customerResponse.ok) throw new Error('Failed to fetch customer data');
      const customerResult = await customerResponse.json();
      if (customerResult.success) {
        setCustomerData(customerResult.data);
      }

      // Fetch inventory data
      const inventoryResponse = await fetch('/api/reports?type=inventory');
      if (!inventoryResponse.ok) throw new Error('Failed to fetch inventory data');
      const inventoryResult = await inventoryResponse.json();
      if (inventoryResult.success) {
        setInventoryData(inventoryResult.data);
      }

      // Fetch payment data
      const paymentResponse = await fetch(
        `/api/reports?type=payments${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`
      );
      if (!paymentResponse.ok) throw new Error('Failed to fetch payment data');
      const paymentResult = await paymentResponse.json();
      if (paymentResult.success) {
        setPaymentData(paymentResult.data);
      }

      // Fetch shipping data
      const shippingResponse = await fetch(
        `/api/reports?type=shipping${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`
      );
      if (!shippingResponse.ok) throw new Error('Failed to fetch shipping data');
      const shippingResult = await shippingResponse.json();
      if (shippingResult.success) {
        setShippingData(shippingResult.data);
      }

      // Fetch refund data
      const refundResponse = await fetch(
        `/api/reports?type=refunds${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`
      );
      if (!refundResponse.ok) throw new Error('Failed to fetch refund data');
      const refundResult = await refundResponse.json();
      if (refundResult.success) {
        setRefundData(refundResult.data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [dateRange, category]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Track and analyze your business performance</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex flex-col">
            <label htmlFor="date-range" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                id="start-date"
                value={dateRange.start ? format(dateRange.start, 'yyyy-MM-dd') : ''}
                onChange={(e) => setDateRange({...dateRange, start: e.target.valueAsDate})}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <span className="self-center text-gray-500">to</span>
              <input
                type="date"
                id="end-date"
                value={dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : ''}
                onChange={(e) => setDateRange({...dateRange, end: e.target.valueAsDate})}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Books">Books</option>
              <option value="Toys">Toys</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500 dark:text-gray-400">Loading reports...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Sales KPI Cards */}
          <SalesCard 
            totalRevenue={salesData.totalRevenue} 
            totalOrders={salesData.totalOrders} 
            avgOrderValue={salesData.avgOrderValue} 
            newCustomers={salesData.newCustomers} 
          />

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProductsChart topProducts={topProducts} />
            <CustomersChart customerData={customerData} />
            <InventoryChart inventoryData={inventoryData} />
            <PaymentsChart paymentData={paymentData} />
            <ShippingChart shippingData={shippingData} />
            <RefundsChart refundData={refundData} />
          </div>
        </>
      )}
    </div>
  );
}