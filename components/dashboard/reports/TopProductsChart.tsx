'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TopProduct {
  _id: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

interface TopProductsChartProps {
  topProducts: TopProduct[];
}

export function TopProductsChart({ topProducts }: TopProductsChartProps) {
  // Format data for the chart, taking top 5 products
  const chartData = topProducts.slice(0, 5).map(product => ({
    name: product._id,
    quantity: product.totalQuantity,
    revenue: product.totalRevenue
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'quantity' ? value : `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                name === 'quantity' ? 'Quantity' : 'Revenue'
              ]}
              labelFormatter={(value) => `Product: ${value}`}
            />
            <Legend />
            <Bar dataKey="quantity" name="Quantity Sold" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" name="Revenue ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}