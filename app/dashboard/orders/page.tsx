'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  CreditCard,
  MoreVertical,
  Search,
  Printer,
  Download
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

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'cancelled' | 'refunded';
  paymentMethod: 'Credit Card' | 'PayPal' | 'Bank Transfer';
  items: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#ORD_0001',
      customer: 'Liam Johnson',
      date: '2023-06-23',
      amount: 120.00,
      status: 'paid',
      paymentMethod: 'Credit Card',
      items: 2
    },
    {
      id: '#ORD_0002',
      customer: 'Olivia Smith',
      date: '2023-06-22',
      amount: 250.00,
      status: 'pending',
      paymentMethod: 'PayPal',
      items: 1
    },
    {
      id: '#ORD_0003',
      customer: 'Noah Williams',
      date: '2023-06-21',
      amount: 180.00,
      status: 'cancelled',
      paymentMethod: 'Credit Card',
      items: 1
    },
    {
      id: '#ORD_0004',
      customer: 'Emma Brown',
      date: '2023-06-20',
      amount: 130.00,
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      items: 2
    },
    {
      id: '#ORD_0005',
      customer: 'William Jones',
      date: '2023-06-19',
      amount: 150.00,
      status: 'paid',
      paymentMethod: 'Credit Card',
      items: 1
    },
    {
      id: '#ORD_0006',
      customer: 'Sophia Davis',
      date: '2023-06-18',
      amount: 220.00,
      status: 'refunded',
      paymentMethod: 'PayPal',
      items: 3
    },
    {
      id: '#ORD_0007',
      customer: 'James Miller',
      date: '2023-06-17',
      amount: 95.00,
      status: 'pending',
      paymentMethod: 'Credit Card',
      items: 1
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>New Order</Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      {order.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.status === 'paid' ? 'default' :
                        order.status === 'pending' ? 'secondary' : 
                        order.status === 'cancelled' ? 'destructive' : 'outline'
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
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
              Showing {filteredOrders.length} of {orders.length} orders
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