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

interface LowStockProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

interface InventoryData {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: LowStockProduct[];
  lowStockCount: number;
}

interface InventoryChartProps {
  inventoryData: InventoryData;
}

export function InventoryChart({ inventoryData }: InventoryChartProps) {
  // Prepare data for the chart
  const chartData = [
    {
      name: 'Total Products',
      count: inventoryData.totalProducts
    },
    {
      name: 'Low Stock Items',
      count: inventoryData.lowStockCount
    },
    {
      name: 'Categories',
      count: inventoryData.totalCategories
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory Insights</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value, 'Count']}
              labelFormatter={(value) => `Metric: ${value}`}
            />
            <Legend />
            <Bar dataKey="count" name="Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Low Stock Items</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {inventoryData.lowStockProducts.slice(0, 5).map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`px-2 py-1 text-xs rounded-full ${product.stock < 5 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {inventoryData.lowStockProducts.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">No low stock items found</p>
        )}
      </div>
    </div>
  );
}