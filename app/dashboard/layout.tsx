import { ReactNode } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';

export default function DashboardLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { slug?: string[] };
}) {
  // Determine page title based on the route
  const getPageTitle = () => {
    if (!params.slug) return 'Dashboard';
    
    const page = params.slug[0];
    switch(page) {
      case 'products': return 'Products';
      case 'orders': return 'Orders';
      case 'customers': return 'Customers';
      case 'inventory': return 'Inventory';
      case 'sales': return 'Sales';
      case 'purchases': return 'Purchases';
      case 'payments': return 'Payments';
      case 'shipping': return 'Shipping';
      case 'marketing': return 'Marketing';
      case 'reports': return 'Reports';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full ml-0 md:ml-64">
        <Header title={getPageTitle()} />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}