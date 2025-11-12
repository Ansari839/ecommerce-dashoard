import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InventoryFiltersProps {
  searchTerm: string;
  category: string;
  location: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

export function InventoryFilters({ 
  searchTerm, 
  category, 
  location,
  onSearchChange,
  onCategoryChange,
  onLocationChange
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="w-full md:w-64">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
        />
      </div>
      
      <div className="w-full md:w-40">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="home">Home & Kitchen</SelectItem>
            <SelectItem value="books">Books</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-40">
        <Select value={location} onValueChange={onLocationChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="warehouse1">Warehouse 1</SelectItem>
            <SelectItem value="warehouse2">Warehouse 2</SelectItem>
            <SelectItem value="store">Store</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}