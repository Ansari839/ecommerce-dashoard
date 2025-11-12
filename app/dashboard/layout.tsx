import React from 'react';
import Sidebar from '@/components/ui/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-screen-xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}