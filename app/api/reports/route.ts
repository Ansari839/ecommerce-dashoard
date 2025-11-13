import { NextRequest, NextResponse } from 'next/server';
import {
  getSalesData,
  getRevenueOverTime,
  getTopProducts,
  getCustomerAnalytics,
  getInventoryInsights,
  getPaymentDistribution,
  getShippingPerformance,
  getRefundsData
} from '@/controllers/reportsController';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'sales';
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const category = searchParams.get('category') || undefined;

    let result;

    switch (reportType) {
      case 'sales':
        result = await getSalesData(startDate, endDate, category);
        break;
      case 'revenue-over-time':
        result = await getRevenueOverTime(startDate, endDate, category);
        break;
      case 'top-products':
        result = await getTopProducts(startDate, endDate, category);
        break;
      case 'customers':
        result = await getCustomerAnalytics(startDate, endDate);
        break;
      case 'inventory':
        result = await getInventoryInsights();
        break;
      case 'payments':
        result = await getPaymentDistribution(startDate, endDate);
        break;
      case 'shipping':
        result = await getShippingPerformance(startDate, endDate);
        break;
      case 'refunds':
        result = await getRefundsData(startDate, endDate);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}