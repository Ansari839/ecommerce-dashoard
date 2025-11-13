"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Truck, 
  TrendingUp, 
  BarChart3, 
  Settings,
  ShoppingCart,
  DollarSign,
  PieChart,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Products', href: '/dashboard/products', icon: Package },
  { title: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { title: 'Customers', href: '/dashboard/customers', icon: Users },
  { title: 'Sales', href: '/dashboard/sales', icon: TrendingUp },
  { title: 'Purchases', href: '/dashboard/purchases', icon: ShoppingCart },
  { title: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { title: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { title: 'Shipping', href: '/dashboard/shipping', icon: Truck },
  { title: 'Marketing', href: '/dashboard/marketing', icon: PieChart },
  { title: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Sidebar backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">eCommerce Dashboard</h1>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={cn(
                      'flex items-center p-3 space-x-3 hover:bg-gray-800 transition-colors',
                      isActive ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                    )}
                    onClick={() => typeof toggleSidebar === 'function' && toggleSidebar()}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}