'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Package
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'active' | 'inactive' | 'discontinued';
  lastUpdated: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'PROD_0001',
      name: 'Nike Air Zoom Pegasus 39',
      category: 'Shoes',
      stock: 120,
      price: 120.00,
      status: 'active',
      lastUpdated: '2023-06-23'
    },
    {
      id: 'PROD_0002',
      name: 'Adidas Ultraboost 22',
      category: 'Shoes',
      stock: 85,
      price: 250.00,
      status: 'active',
      lastUpdated: '2023-06-22'
    },
    {
      id: 'PROD_0003',
      name: 'New Balance Fresh Foam X Hierro v7',
      category: 'Hiking Footwear',
      stock: 0,
      price: 180.00,
      status: 'inactive',
      lastUpdated: '2023-06-21'
    },
    {
      id: 'PROD_0004',
      name: 'Saucony Ride 15',
      category: 'Running Shoes',
      stock: 200,
      price: 130.00,
      status: 'active',
      lastUpdated: '2023-06-20'
    },
    {
      id: 'PROD_0005',
      name: 'Hoka Clifton 8',
      category: 'Running Shoes',
      stock: 150,
      price: 150.00,
      status: 'active',
      lastUpdated: '2023-06-19'
    },
    {
      id: 'PROD_0006',
      name: 'ASICS Gel-Kayano 29',
      category: 'Running Shoes',
      stock: 90,
      price: 160.00,
      status: 'active',
      lastUpdated: '2023-06-18'
    },
    {
      id: 'PROD_0007',
      name: 'Brooks Ghost 15',
      category: 'Running Shoes',
      stock: 0,
      price: 140.00,
      status: 'discontinued',
      lastUpdated: '2023-06-17'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <Button>Add Product</Button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Shoes">Shoes</SelectItem>
            <SelectItem value="Clothing">Clothing</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Hiking Footwear">Hiking Footwear</SelectItem>
            <SelectItem value="Running Shoes">Running Shoes</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.stock > 0 ? 'default' : 'destructive'}
                    >
                      {product.stock} {product.stock === 0 ? 'Out of Stock' : 'Available'}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        product.status === 'active' ? 'default' :
                        product.status === 'inactive' ? 'secondary' : 'destructive'
                      }
                    >
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(product.lastUpdated).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between items-center w-full">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}