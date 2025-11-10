'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductSearch from '@/components/dashboard/ProductSearch';
import ProductTable from '@/components/dashboard/ProductTable';
import AddProductModal from '@/components/dashboard/AddProductModal';

const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products Management</h1>
          <p className="text-muted-foreground">Manage your products and inventory</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Product List</CardTitle>
          <ProductSearch />
        </CardHeader>
        <CardContent>
          <ProductTable />
        </CardContent>
      </Card>
      
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default ProductsPage;