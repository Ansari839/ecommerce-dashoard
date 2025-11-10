'use client';

import React from 'react';
import Sidebar from '@/components/ui/Sidebar';

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 md:ml-0 pt-16 md:pt-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome to Dashboard</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            This is the main content area of the eCommerce dashboard.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;