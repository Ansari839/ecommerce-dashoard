'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface CustomerData {
  customerCount: number;
  avgOrderCount: number;
  avgTotalSpent: number;
  totalRevenue: number;
  newCustomers: number;
  returningCustomers: number;
}

interface CustomersChartProps {
  customerData: CustomerData;
}

// Prepare data for the chart
const prepareData = (data: CustomerData) => {
  return [
    {
      name: 'New Customers',
      count: data.newCustomers,
      fill: '#3b82f6' // blue
    },
    {
      name: 'Returning Customers',
      count: data.returningCustomers,
      fill: '#10b981' // green
    }
  ];
};

export function CustomersChart({ customerData }: CustomersChartProps) {
  const chartData = prepareData(customerData);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Analytics</h3>
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
              formatter={(value) => [value, 'Customers']}
              labelFormatter={(value) => `Customer Type: ${value}`}
            />
            <Legend />
            <Bar dataKey="count" name="Customer Count">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Order Count</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{customerData.avgOrderCount.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Lifetime Value</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            ${customerData.avgTotalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}