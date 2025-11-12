'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductSearch } from '@/components/dashboard/ProductSearch';
import { ProductTable } from '@/components/dashboard/ProductTable';
import { AddProductModal } from '@/components/dashboard/AddProductModal';
import { useDebounce } from '@/lib/useDebounce';
import { Plus } from 'lucide-react';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger refresh

  // Debounce the search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Trigger a refresh by updating the refreshTrigger state
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle deleting a product
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        // Trigger a refresh of the product list
        handleRefresh();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Products Management</h1>
          <p className="text-muted-foreground mt-1">Manage your products inventory and catalog</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <ProductSearch value={searchTerm} onChange={setSearchTerm} />
      </div>

      <ProductTable
        onProductUpdated={handleRefresh}
        onDelete={handleDeleteProduct}
        searchTerm={debouncedSearchTerm}
      />

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleRefresh}
      />
    </div>
  );
}