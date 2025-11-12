import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

interface ReportKPIProps {
  totalSales: number;
  totalOrders: number;
  netProfit: number;
  avgOrderValue: number;
}

export function ReportKPI({ 
  totalSales, 
  totalOrders, 
  netProfit, 
  avgOrderValue 
}: ReportKPIProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">+8.2% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${netProfit.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">+15.3% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
          <Package className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">+3.7% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}