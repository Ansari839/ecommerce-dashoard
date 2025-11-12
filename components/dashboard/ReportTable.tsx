import { Badge } from '@/components/ui/badge';

interface ReportRow {
  metric: string;
  value: string;
  change: string;
  dateRange: string;
}

interface ReportTableProps {
  data: ReportRow[];
}

export function ReportTable({ data }: ReportTableProps) {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Metric</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change %</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Range</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{row.metric}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.value}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Badge 
                  className={
                    row.change.startsWith('+') ? 
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }
                >
                  {row.change}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.dateRange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}