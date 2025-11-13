'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface PaymentMethod {
  _id: string;
  count: number;
  totalAmount: number;
}

interface StatusCount {
  _id: string;
  count: number;
}

interface PaymentData {
  paymentDistribution: PaymentMethod[];
  statusCounts: StatusCount[];
}

interface PaymentsChartProps {
  paymentData: PaymentData;
}

// Prepare data for the payment method distribution pie chart
const preparePaymentMethodData = (paymentDistribution: PaymentMethod[]) => {
  return paymentDistribution.map(method => ({
    name: method._id,
    count: method.count,
    totalAmount: method.totalAmount
  }));
};

// Prepare data for the status distribution pie chart
const prepareStatusData = (statusCounts: StatusCount[]) => {
  return statusCounts.map(status => ({
    name: status._id,
    count: status.count
  }));
};

export function PaymentsChart({ paymentData }: PaymentsChartProps) {
  const paymentMethodData = preparePaymentMethodData(paymentData.paymentDistribution);
  const statusData = prepareStatusData(paymentData.statusCounts);

  // Colors for charts
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const STATUS_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Reports</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method Distribution */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Payment Method Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'count' ? value : `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    name === 'count' ? 'Count' : 'Amount'
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Payment Status Distribution */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Payment Status Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}