import { OrderFilters } from '@/components/dashboard/OrderFilters';
import { OrdersTable } from '@/components/dashboard/OrdersTable';

export default function OrdersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground">Manage and track all orders</p>
      </div>
      
      <div className="space-y-4">
        <OrderFilters />
        <OrdersTable />
      </div>
    </div>
  );
}