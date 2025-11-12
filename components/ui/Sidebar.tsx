'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Moon,
  Sun,
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  Megaphone,
  BarChart,
  Store,
  Settings,
  TrendingUp,
  ShoppingBag,
  Warehouse
} from 'lucide-react';
import { useTheme } from '@/lib/theme-provider';

// Define the navigation items
const navItems = [
  { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'Orders', path: '/dashboard/orders', icon: Package },
  { name: 'Products', path: '/dashboard/products', icon: ShoppingCart },
  { name: 'Customers', path: '/dashboard/customers', icon: Users },
  { name: 'Payments', path: '/dashboard/payments', icon: CreditCard },
  { name: 'Shipping', path: '/dashboard/shipping', icon: Truck },
  { name: 'Marketing', path: '/dashboard/marketing', icon: Megaphone },
  { name: 'Reports', path: '/dashboard/reports', icon: BarChart },
  { name: 'Sales', path: '/dashboard/sales', icon: TrendingUp },
  { name: 'Purchase', path: '/dashboard/purchases', icon: ShoppingBag },
  { name: 'Inventory', path: '/dashboard/inventory', icon: Warehouse },
  { name: 'Vendors', path: '/dashboard/vendors', icon: Store },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white dark:bg-gray-700"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-40 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Theme toggle button - top section */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">eCommerce Dashboard</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      onClick={handleLinkClick}
                      className={`flex items-center p-3 rounded-lg transition-colors ${
                        pathname === item.path
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <IconComponent size={20} className="mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} eCommerce Dashboard
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;