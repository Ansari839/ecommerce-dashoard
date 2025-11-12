'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InventoryFilters } from '@/components/dashboard/InventoryFilters';
import { InventoryTable } from '@/components/dashboard/InventoryTable';
import { AddItemModal } from '@/components/dashboard/AddItemModal';
import { Plus } from 'lucide-react';

// Define the InventoryItem type
interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
}

export default function InventoryPage() {
  // Static sample inventory data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: 'INV-1001', name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', quantity: 150, unit: 'pcs', location: 'Warehouse 1' },
    { id: 'INV-1002', name: 'Cotton T-Shirt', sku: 'TS-002', category: 'Clothing', quantity: 500, unit: 'pcs', location: 'Warehouse 2' },
    { id: 'INV-1003', name: 'Coffee Maker', sku: 'CM-003', category: 'Home & Kitchen', quantity: 75, unit: 'pcs', location: 'Warehouse 1' },
    { id: 'INV-1004', name: 'Programming Book', sku: 'PB-004', category: 'Books', quantity: 200, unit: 'pcs', location: 'Warehouse 2' },
    { id: 'INV-1005', name: 'Desk Lamp', sku: 'DL-005', category: 'Home & Kitchen', quantity: 85, unit: 'pcs', location: 'Store' },
    { id: 'INV-1006', name: 'Running Shoes', sku: 'RS-006', category: 'Clothing', quantity: 45, unit: 'pcs', location: 'Store' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter inventory items based on search term, category, and location
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === 'all' || item.category.toLowerCase().includes(category);
    const matchesLocation = location === 'all' || item.location.toLowerCase().includes(location);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleAddItem = (itemData: InventoryItem) => {
    setInventoryItems([itemData, ...inventoryItems]);
  };

  const handleViewItem = (item: InventoryItem) => {
    console.log('View item:', item);
    // In a real implementation, you would navigate to the item details page
  };

  const handleEditItem = (item: InventoryItem) => {
    console.log('Edit item:', item);
    // In a real implementation, you would open an edit modal
  };

  const handleDeleteItem = (id: string) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage and track your stock items</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <InventoryFilters 
        searchTerm={searchTerm}
        category={category}
        location={location}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        onLocationChange={setLocation}
      />

      <InventoryTable 
        items={filteredItems}
        onView={handleViewItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />

      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}