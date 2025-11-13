'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  RefreshCw
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ProfitLossData {
  _id: string;
  period: string;
  totalRevenue: number;
  totalCost: number;
  totalExpenses: number;
  netProfit: number;
  grossProfit: number;
  revenueByCategory?: { [category: string]: number };
  costByCategory?: { [category: string]: number };
  expensesByCategory?: { [category: string]: number };
  createdAt: string;
  updatedAt: string;
}

interface CategoryWiseData {
  [category: string]: {
    revenue: number;
    cost: number;
    expenses: number;
    profit: number;
  };
}

const ProfitLossDashboard = () => {
  const [plData, setPlData] = useState<ProfitLossData | null>(null);
  const [categoryWiseData, setCategoryWiseData] = useState<CategoryWiseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'categories'

  useEffect(() => {
    fetchPLData();
  }, [selectedPeriod]);

  const fetchPLData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        period: selectedPeriod,
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate }),
      });
      
      const response = await fetch(`/api/pl?${params}`);
      const data = await response.json();
      if (data.success) {
        setPlData(data.data);
      }
    } catch (error) {
      console.error('Error fetching P&L data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryWiseData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        period: selectedPeriod,
        categoryWise: 'true',
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate }),
      });
      
      const response = await fetch(`/api/pl?${params}`);
      const data = await response.json();
      if (data.success) {
        setCategoryWiseData(data.data);
      }
    } catch (error) {
      console.error('Error fetching category-wise P&L data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewReport = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/pl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token' // In a real app, use actual token
        },
        body: JSON.stringify({
          period: selectedPeriod,
          ...(dateRange.startDate && { startDate: dateRange.startDate }),
          ...(dateRange.endDate && { endDate: dateRange.endDate }),
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setPlData(data.data);
      }
    } catch (error) {
      console.error('Error generating new P&L report:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchToCategoryView = () => {
    if (activeTab === 'summary') {
      setActiveTab('categories');
      fetchCategoryWiseData();
    } else {
      setActiveTab('summary');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const profitColor = plData && plData.netProfit >= 0 ? 'text-green-600' : 'text-red-600';
  const profitIcon = plData && plData.netProfit >= 0 ? TrendingUp : TrendingDown;

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-20">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">Loading Profit & Loss report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profit & Loss</h1>
          <p className="text-muted-foreground">Financial summary and analysis</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
          <Button onClick={generateNewReport}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Recalculate
          </Button>
        </div>
      </div>

      {plData && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(plData.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Total sales income</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(plData.totalCost)}</div>
                <p className="text-xs text-muted-foreground">Cost of goods sold</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(plData.totalExpenses)}</div>
                <p className="text-xs text-muted-foreground">Operational expenses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                {React.createElement(profitIcon, { className: "h-4 w-4 text-muted-foreground" })}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${profitColor}`}>
                  {formatCurrency(plData.netProfit)}
                </div>
                <p className="text-xs text-muted-foreground">Revenue minus costs and expenses</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {activeTab === 'summary' ? 'P&L Summary' : 'Category-Wise Breakdown'}
            </h2>
            <Button variant="outline" onClick={switchToCategoryView}>
              {activeTab === 'summary' ? 'View by Category' : 'View Summary'}
            </Button>
          </div>

          {activeTab === 'summary' ? (
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Gross Profit</span>
                    <span className="font-semibold">{formatCurrency(plData.grossProfit)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Revenue</span>
                    <span>{formatCurrency(plData.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground ml-4">Cost of Goods Sold</span>
                    <span className="text-muted-foreground">- {formatCurrency(plData.totalCost)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Expenses</span>
                    <span>{formatCurrency(plData.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 font-bold text-lg border-t border-b-2">
                    <span>Net Profit/Loss</span>
                    <span className={profitColor}>{formatCurrency(plData.netProfit)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Category-Wise Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryWiseData ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Category/Platform</th>
                          <th className="text-right py-2">Revenue</th>
                          <th className="text-right py-2">Cost</th>
                          <th className="text-right py-2">Expenses</th>
                          <th className="text-right py-2">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(categoryWiseData).map(([category, data]) => (
                          <tr key={category} className="border-b">
                            <td className="py-2 font-medium">{category}</td>
                            <td className="text-right">{formatCurrency(data.revenue)}</td>
                            <td className="text-right">{formatCurrency(data.cost)}</td>
                            <td className="text-right">{formatCurrency(data.expenses)}</td>
                            <td className={`text-right font-semibold ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(data.profit)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>Select "View by Category" to see category-wise breakdown</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!plData && (
        <div className="text-center py-20">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No P&L Data Available</h3>
          <p className="mt-2 text-muted-foreground">
            Click "Recalculate" to generate a new Profit & Loss report
          </p>
          <Button 
            className="mt-6" 
            onClick={generateNewReport}
          >
            Generate Report
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfitLossDashboard;