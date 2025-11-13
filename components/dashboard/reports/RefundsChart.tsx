'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface RefundData {
  totalRefunds: number;
  totalRefundAmount: number;
  avgRefundAmount: number;
}

interface RefundsChartProps {
  refundData: RefundData;
}

// Prepare data for the chart
const prepareData = (data: RefundData) => {
  return [
    {
      name: 'Total Refunds',
      value: data.totalRefunds
    },
    {
      name: 'Total Refund Amount',
      value: data.totalRefundAmount
    },
    {
      name: 'Avg Refund Amount',
      value: data.avgRefundAmount
    }
  ];
};

export function RefundsChart({ refundData }: RefundsChartProps) {
  const chartData = prepareData(refundData);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Refunds & Returns</h3>
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
            <YAxis 
              tickFormatter={(value) => 
                typeof value === 'number' && value > 1000 ? `${(value / 1000).toFixed(1)}k` : value
              }
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'Total Refund Amount' || name === 'Avg Refund Amount' 
                  ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : value,
                name
              ]}
              labelFormatter={(value) => `Metric: ${value}`}
            />
            <Bar dataKey="value" name="Value" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Refunds</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{refundData.totalRefunds}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Refund Amount</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            ${refundData.totalRefundAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Refund Amount</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            ${refundData.avgRefundAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}