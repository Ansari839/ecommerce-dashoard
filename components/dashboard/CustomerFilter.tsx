import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerFilterProps {
  searchTerm: string;
  customerType: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function CustomerFilter({ searchTerm, customerType, onSearchChange, onTypeChange }: CustomerFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="w-full md:w-64">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
        />
      </div>
      <div className="w-full md:w-48">
        <Select value={customerType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Customer Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}