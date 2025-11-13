import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentSummaryCardProps {
  totalRevenue: number;
  pending: number;
  failed: number;
  refunded: number;
}

export function PaymentSummaryCard({ 
  totalRevenue, 
  pending, 
  failed, 
  refunded 
}: PaymentSummaryCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Total Revenue
          </CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">All completed transactions</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Pending Payments
          </CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{pending}</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Awaiting processing</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Failed Payments
          </CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{failed}</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Unsuccessful transactions</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Refunded Amount
          </CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 00-2-2H8z" />
            <path d="M2 8a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">${refunded.toFixed(2)}</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Refunded transactions</p>
        </CardContent>
      </Card>
    </div>
  );
}