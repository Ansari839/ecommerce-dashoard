'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail,
  Phone,
  MapPin,
  Calendar,
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

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUS_0001',
      name: 'Liam Johnson',
      email: 'liam@example.com',
      phone: '(201) 555-0124',
      location: 'San Francisco, USA',
      joinDate: '2022-03-15',
      orders: 4,
      totalSpent: 2128.99,
      status: 'active'
    },
    {
      id: 'CUS_0002',
      name: 'Olivia Smith',
      email: 'olivia@example.com',
      phone: '(202) 555-0132',
      location: 'London, UK',
      joinDate: '2022-05-22',
      orders: 3,
      totalSpent: 1547.50,
      status: 'active'
    },
    {
      id: 'CUS_0003',
      name: 'Noah Williams',
      email: 'noah@example.com',
      phone: '(203) 555-0141',
      location: 'Toronto, Canada',
      joinDate: '2022-07-18',
      orders: 2,
      totalSpent: 420.00,
      status: 'inactive'
    },
    {
      id: 'CUS_0004',
      name: 'Emma Brown',
      email: 'emma@example.com',
      phone: '(204) 555-0153',
      location: 'Sydney, Australia',
      joinDate: '2022-09-30',
      orders: 6,
      totalSpent: 3245.75,
      status: 'active'
    },
    {
      id: 'CUS_0005',
      name: 'William Jones',
      email: 'william@example.com',
      phone: '(205) 555-0165',
      location: 'Berlin, Germany',
      joinDate: '2023-01-14',
      orders: 1,
      totalSpent: 150.00,
      status: 'active'
    },
    {
      id: 'CUS_0006',
      name: 'Sophia Davis',
      email: 'sophia@example.com',
      phone: '(206) 555-0179',
      location: 'Paris, France',
      joinDate: '2023-02-28',
      orders: 5,
      totalSpent: 2890.25,
      status: 'active'
    },
    {
      id: 'CUS_0007',
      name: 'James Miller',
      email: 'james@example.com',
      phone: '(207) 555-0187',
      location: 'Tokyo, Japan',
      joinDate: '2023-04-12',
      orders: 3,
      totalSpent: 1240.50,
      status: 'inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>Add Customer</Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search customers..." 
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {customer.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={customer.status === 'active' ? 'default' : 'secondary'}
                    >
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
                  </TableCell>
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
              Showing {filteredCustomers.length} of {customers.length} customers
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