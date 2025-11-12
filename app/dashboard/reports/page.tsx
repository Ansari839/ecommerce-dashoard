'use client';

import { useState } from 'react';
import { ReportFilters } from '@/components/dashboard/ReportFilters';
import { ReportKPI } from '@/components/dashboard/ReportKPI';
import { ReportCharts } from '@/components/dashboard/ReportCharts';
import { ReportTable } from '@/components/dashboard/ReportTable';

interface ReportRow {
  metric: string;
  value: string;
  change: string;
  dateRange: string;
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [reportType, setReportType] = useState('sales');

  // Static data for the report table
  const reportData: ReportRow[] = [
    { metric: 'Gross Sales', value: '$45,230.00', change: '+12.5%', dateRange: 'Oct 1 - Oct 31' },
    { metric: 'Net Sales', value: '$38,542.50', change: '+10.8%', dateRange: 'Oct 1 - Oct 31' },
    { metric: 'Total Orders', value: '1,245', change: '+8.2%', dateRange: 'Oct 1 - Oct 31' },
    { metric: 'Avg. Order Value', value: '$36.78', change: '+3.7%', dateRange: 'Oct 1 - Oct 31' },
    { metric: 'Conversion Rate', value: '3.2%', change: '+0.5%', dateRange: 'Oct 1 - Oct 31' },
    { metric: 'Customer Acquisition', value: '420', change: '+15.3%', dateRange: 'Oct 1 - Oct 31' },
  ];

  const handleGenerateReport = () => {
    console.log('Generating report for:', { dateRange, reportType });
    // In a real implementation, this would trigger the report generation
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">View and analyze your business performance</p>
      </div>

      <ReportFilters 
        dateRange={dateRange}
        reportType={reportType}
        onDateRangeChange={setDateRange}
        onReportTypeChange={setReportType}
        onGenerateReport={handleGenerateReport}
      />

      <ReportKPI 
        totalSales={45230}
        totalOrders={1245}
        netProfit={28750}
        avgOrderValue={36.78}
      />

      <ReportCharts />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Detailed Report Data</h2>
        <ReportTable data={reportData} />
      </div>
    </div>
  );
}