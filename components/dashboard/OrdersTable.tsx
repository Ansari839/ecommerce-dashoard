import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

const orders = [
  { id: '#ORD-001', customer: 'John Doe', date: '2023-01-15', total: '$245.99', payment: 'Credit Card', status: 'delivered' },
  { id: '#ORD-002', customer: 'Jane Smith', date: '2023-01-16', total: '$129.50', payment: 'PayPal', status: 'shipped' },
  { id: '#ORD-003', customer: 'Robert Johnson', date: '2023-01-17', total: '$89.99', payment: 'Credit Card', status: 'pending' },
  { id: '#ORD-004', customer: 'Emily Davis', date: '2023-01-18', total: '$342.75', payment: 'Bank Transfer', status: 'delivered' },
  { id: '#ORD-005', customer: 'Michael Wilson', date: '2023-01-19', total: '$199.00', payment: 'Credit Card', status: 'returned' },
  { id: '#ORD-006', customer: 'Sarah Miller', date: '2023-01-20', total: '$156.25', payment: 'PayPal', status: 'shipped' },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500 hover:bg-yellow-500/80';
    case 'shipped':
      return 'bg-blue-500 hover:bg-blue-500/80';
    case 'delivered':
      return 'bg-green-500 hover:bg-green-500/80';
    case 'returned':
      return 'bg-red-500 hover:bg-red-500/80';
    default:
      return 'bg-gray-500 hover:bg-gray-500/80';
  }
};

export function OrdersTable() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.payment}</TableCell>
              <TableCell>
                <Badge className={getStatusVariant(order.status)}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}