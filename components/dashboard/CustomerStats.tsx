import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, Activity } from 'lucide-react';

interface CustomerStatsProps {
  totalCustomers: number;
  activeCustomers: number;
  vipCustomers: number;
}

export function CustomerStats({ 
  totalCustomers, 
  activeCustomers, 
  vipCustomers 
}: CustomerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCustomers}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
          <Star className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{vipCustomers}</div>
        </CardContent>
      </Card>
    </div>
  );
}