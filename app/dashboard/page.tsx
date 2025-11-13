'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Package,
  CreditCard
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  price: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
}

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: 12.5,
      icon: <DollarSign className="h-4 w-4" />,
      trend: 'up' as const
    },
    {
      title: 'Subscriptions',
      value: '+2350',
      change: -2.3,
      icon: <Users className="h-4 w-4" />,
      trend: 'down' as const
    },
    {
      title: 'Sales',
      value: '+12,234',
      change: 18.2,
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'up' as const
    },
    {
      title: 'Active Now',
      value: '+573',
      change: 3.1,
      icon: <ShoppingCart className="h-4 w-4" />,
      trend: 'up' as const
    }
  ];

  const recentOrders = [
    {
      id: '#ORD_0001',
      customer: 'Liam Johnson',
      product: 'Nike Air Zoom Pegasus 39',
      price: 120.00,
      status: 'paid',
      date: '2023-06-23'
    },
    {
      id: '#ORD_0002',
      customer: 'Olivia Smith',
      product: 'Adidas Ultraboost 22',
      price: 250.00,
      status: 'pending',
      date: '2023-06-22'
    },
    {
      id: '#ORD_0003',
      customer: 'Noah Williams',
      product: 'New Balance Fresh Foam X Hierro v7',
      price: 180.00,
      status: 'failed',
      date: '2023-06-21'
    },
    {
      id: '#ORD_0004',
      customer: 'Emma Brown',
      product: 'Saucony Ride 15',
      price: 130.00,
      status: 'paid',
      date: '2023-06-20'
    },
    {
      id: '#ORD_0005',
      customer: 'William Jones',
      product: 'Hoka Clifton 8',
      price: 150.00,
      status: 'paid',
      date: '2023-06-19'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <Button>View Report</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(stat.change)}% from last month
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell className="text-right">${order.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.status === 'paid' ? 'default' : 
                                order.status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </CardFooter>
        </Card>

        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0">
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Product Shipped</p>
                  <p className="text-sm text-gray-500 truncate">John Doe ordered Nike Sneakers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Just now</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0">
                  <CreditCard className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Payment Received</p>
                  <p className="text-sm text-gray-500 truncate">New payment of $250.00</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">New Customer</p>
                  <p className="text-sm text-gray-500 truncate">Emily Johnson joined</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Top Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Nike Air Zoom Pegasus 39</TableCell>
                <TableCell>Running Shoes</TableCell>
                <TableCell className="text-right">245</TableCell>
                <TableCell className="text-right">$29,400.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Adidas Ultraboost 22</TableCell>
                <TableCell>Running Shoes</TableCell>
                <TableCell className="text-right">189</TableCell>
                <TableCell className="text-right">$47,250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">New Balance Fresh Foam X Hierro v7</TableCell>
                <TableCell>Hiking Shoes</TableCell>
                <TableCell className="text-right">156</TableCell>
                <TableCell className="text-right">$28,080.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Saucony Ride 15</TableCell>
                <TableCell>Running Shoes</TableCell>
                <TableCell className="text-right">142</TableCell>
                <TableCell className="text-right">$18,460.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Hoka Clifton 8</TableCell>
                <TableCell>Running Shoes</TableCell>
                <TableCell className="text-right">134</TableCell>
                <TableCell className="text-right">$20,100.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}