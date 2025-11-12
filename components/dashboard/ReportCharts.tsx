import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Revenue Trend Chart</p>
              <p className="text-sm text-muted-foreground">Visualization would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Category-wise Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Category-wise Sales Chart</p>
              <p className="text-sm text-muted-foreground">Visualization would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}