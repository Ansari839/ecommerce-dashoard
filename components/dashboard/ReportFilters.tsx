import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportFiltersProps {
  dateRange: string;
  reportType: string;
  onDateRangeChange: (value: string) => void;
  onReportTypeChange: (value: string) => void;
  onGenerateReport: () => void;
}

export function ReportFilters({ 
  dateRange, 
  reportType, 
  onDateRangeChange, 
  onReportTypeChange, 
  onGenerateReport 
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
      <div className="w-full md:w-48">
        <input
          type="text"
          placeholder="Select date range"
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
        />
      </div>
      
      <div className="w-full md:w-40">
        <Select value={reportType} onValueChange={onReportTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="customers">Customers</SelectItem>
            <SelectItem value="products">Products</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-auto">
        <Button onClick={onGenerateReport}>Generate Report</Button>
      </div>
    </div>
  );
}