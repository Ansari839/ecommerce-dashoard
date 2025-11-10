import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const topProducts = [
  { id: 1, name: 'Product A', sales: 1234 },
  { id: 2, name: 'Product B', sales: 987 },
  { id: 3, name: 'Product C', sales: 765 },
  { id: 4, name: 'Product D', sales: 543 },
  { id: 5, name: 'Product E', sales: 432 },
];

export function TopProducts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sales} units</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}