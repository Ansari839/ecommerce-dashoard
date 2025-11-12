'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductSearch } from '@/components/dashboard/ProductSearch';
import { ProductTable } from '@/components/dashboard/ProductTable';
import { AddProductModal } from '@/components/dashboard/AddProductModal';
import { Plus } from 'lucide-react';

// Define the Product type
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'out_of_stock';
}

export default function ProductsPage() {
  // Sample product data
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 25, status: 'active' },
    { id: 2, name: 'Running Shoes', category: 'Footwear', price: 79.95, stock: 0, status: 'out_of_stock' },
    { id: 3, name: 'Cotton T-Shirt', category: 'Clothing', price: 24.99, stock: 120, status: 'active' },
    { id: 4, name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 10, status: 'active' },
    { id: 5, name: 'Coffee Maker', category: 'Home Appliance', price: 89.99, stock: 15, status: 'draft' },
    { id: 6, name: 'Desk Lamp', category: 'Home Decor', price: 39.99, stock: 30, status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (productData: any) => {
    const newProduct: Product = {
      ...productData,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    console.log('Edit product:', product);
    // In a real implementation, you would open the modal with the product data
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
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
        products={filteredProducts} 
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <AddProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProduct}
      />
    </div>
  );
}