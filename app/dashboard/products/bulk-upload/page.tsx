'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface ProductData {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  image: string;
}

export default function BulkProductUploadPage() {
  const [products, setProducts] = useState<ProductData[]>(Array(15).fill(null).map(() => ({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active',
    image: ''
  })));
  
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleProductChange = (index: number, field: keyof ProductData, value: string | number | 'active' | 'inactive' | 'discontinued') => {
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value
      };
      return updatedProducts;
    });
  };

  const handleAddProduct = () => {
    if (products.length >= 20) {
      alert('Maximum of 20 products allowed');
      return;
    }
    
    setProducts(prevProducts => [
      ...prevProducts,
      { 
        name: '', 
        category: '', 
        price: 0, 
        stock: 0, 
        status: 'active', 
        image: '' 
      }
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length <= 15) {
      alert('Minimum of 15 products required');
      return;
    }
    
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts.splice(index, 1);
      return updatedProducts;
    });
  };

  const handleBulkUpload = async () => {
    // Validate required fields for all products
    for (const product of products) {
      if (!product.name || !product.category || product.price <= 0 || product.stock < 0) {
        alert('Please fill in all required fields for all products');
        return;
      }
    }

    setUploadStatus('uploading');
    setProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call the bulk API endpoint
      const response = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-jwt-token'}` // In real app, use actual token
        },
        body: JSON.stringify(products)
      });

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);

      if (response.ok) {
        setUploadStatus('success');
        setResult(data);
        // Reset form after successful upload
        setProducts(Array(15).fill(null).map(() => ({
          name: '',
          category: '',
          price: 0,
          stock: 0,
          status: 'active',
          image: ''
        })));
      } else {
        setUploadStatus('error');
        setResult(data);
      }
    } catch (error) {
      console.error('Error uploading products:', error);
      setUploadStatus('error');
      setResult({ error: 'An unexpected error occurred during upload' });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bulk Product Upload</h1>
          <p className="text-muted-foreground">
            Upload multiple products at once. Minimum 15, maximum 20 products.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Enter details for multiple products to upload at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Product #{index + 1}</h3>
                  {products.length > 15 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor={`name-${index}`}>Product Name *</Label>
                    <Input
                      id={`name-${index}`}
                      value={product.name}
                      onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`category-${index}`}>Category *</Label>
                    <Input
                      id={`category-${index}`}
                      value={product.category}
                      onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                      placeholder="e.g. Electronics"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`price-${index}`}>Price ($) *</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`stock-${index}`}>Stock *</Label>
                    <Input
                      id={`stock-${index}`}
                      type="number"
                      min="0"
                      value={product.stock}
                      onChange={(e) => handleProductChange(index, 'stock', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`status-${index}`}>Status</Label>
                    <Select 
                      value={product.status} 
                      onValueChange={(value: 'active' | 'inactive' | 'discontinued') => handleProductChange(index, 'status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`image-${index}`}>Image URL</Label>
                    <Input
                      id={`image-${index}`}
                      type="url"
                      value={product.image}
                      onChange={(e) => handleProductChange(index, 'image', e.target.value)}
                      placeholder="https://example.com/product-image.jpg"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleAddProduct}
                disabled={products.length >= 20}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
              
              <div>
                <Badge variant="outline">
                  Products: {products.length}/20
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {uploadStatus === 'uploading' && (
            <div className="w-full mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Uploading products...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-2 bg-blue-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {(uploadStatus === 'success' || uploadStatus === 'error') && (
            <div className={`w-full p-4 rounded-lg mb-4 ${
              uploadStatus === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {uploadStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-medium ${
                    uploadStatus === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {uploadStatus === 'success' ? 'Upload Successful!' : 'Upload Failed!'}
                  </h3>
                  <div className="mt-1 text-sm">
                    {result && (
                      <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded mt-2">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            className="w-full md:w-auto" 
            onClick={handleBulkUpload}
            disabled={uploadStatus === 'uploading' || products.length < 15 || products.length > 20}
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload {products.length} Products
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upload from CSV Template</CardTitle>
          <CardDescription>
            Download our template, fill in your product data, and upload it directly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Download CSV Template
            </Button>
            <div className="flex-1 w-full">
              <Label htmlFor="csv-upload">Upload CSV File</Label>
              <Input id="csv-upload" type="file" accept=".csv" className="mt-1" />
            </div>
            <Button variant="secondary">
              Upload CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}