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

interface ShippingCourier {
  _id: string;
  count: number;
  avgDeliveryTime: number;
  completed: number;
  pending: number;
}

interface ShippingData {
  shippingData: ShippingCourier[];
  pendingShipments: number;
}

interface ShippingChartProps {
  shippingData: ShippingData;
}

// Prepare data for the chart
const prepareData = (shippingData: ShippingCourier[]) => {
  return shippingData.map(courier => ({
    name: courier._id,
    completed: courier.completed,
    pending: courier.pending,
    count: courier.count
  }));
};

export function ShippingChart({ shippingData }: ShippingChartProps) {
  const chartData = prepareData(shippingData.shippingData);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Performance</h3>
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
              formatter={(value) => [value, 'Shipments']}
              labelFormatter={(value) => `Courier: ${value}`}
            />
            <Legend />
            <Bar dataKey="completed" name="Completed Shipments" stackId="a">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#10b981" />
              ))}
            </Bar>
            <Bar dataKey="pending" name="Pending Shipments" stackId="a">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#f59e0b" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Shipments</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {shippingData.shippingData.reduce((sum, item) => sum + item.count, 0)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Shipments</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{shippingData.pendingShipments}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Top Courier</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {shippingData.shippingData.length > 0 
              ? shippingData.shippingData.reduce((prev, current) => 
                  (prev.count > current.count) ? prev : current
                )._id 
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}