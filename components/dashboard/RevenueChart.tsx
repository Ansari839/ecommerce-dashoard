import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RevenueChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">Revenue Chart</div>
          <div className="text-sm text-muted-foreground">Visualization would appear here</div>
        </div>
      </CardContent>
    </Card>
  );
}