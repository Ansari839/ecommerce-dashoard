import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { TopProducts } from '@/components/dashboard/TopProducts';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

export default function OverviewPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Dashboard &gt; Overview
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Sales"
          value="$12,345"
          description="+12% from last month"
          icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Orders"
          value="1,234"
          description="+8% from last month"
          icon={<ShoppingBag className="h-6 w-6 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Customers"
          value="987"
          description="+5% from last month"
          icon={<Users className="h-6 w-6 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Products"
          value="567"
          description="+3% from last month"
          icon={<Package className="h-6 w-6 text-muted-foreground" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TopProducts />
      </div>
    </div>
  );
}