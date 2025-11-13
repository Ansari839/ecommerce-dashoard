import { NextRequest, NextResponse } from 'next/server';
import Payment from '@/models/Payment';
import { connectDB } from '@/lib/db';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const status = searchParams.get('status') || undefined;
    const method = searchParams.get('method') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query object
    let query: any = {};

    // Apply date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Apply status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Apply method filter
    if (method && method !== 'all') {
      query.method = method;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Payment.countDocuments(query);

    // Get payments with pagination
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date newest first
      .skip(skip)
      .limit(limit);

    // Calculate totals for summary
    const summary = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$status', 'Paid'] }, { $eq: ['$status', 'Refunded'] }] },
                '$amount',
                0
              ]
            }
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
            }
          },
          failedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0]
            }
          },
          refundedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Refunded'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    const summaryData = summary.length > 0 ? summary[0] : {
      totalRevenue: 0,
      pendingCount: 0,
      failedCount: 0,
      refundedAmount: 0
    };

    // Format the result
    const result = {
      payments: payments.map(payment => ({
        id: payment._id.toString(),
        transactionId: payment.paymentId,
        order: { id: payment.orderId },
        customer: { id: payment.customerId, name: payment.customerName },
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        date: payment.date.toISOString()
      })),
      summary: {
        totalRevenue: summaryData.totalRevenue,
        pending: summaryData.pendingCount,
        failed: summaryData.failedCount,
        refunded: summaryData.refundedAmount
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      }
    };

    return NextResponse.json(success(result, MESSAGES.PAYMENTS_FETCHED));
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'refund':
        return handleRefundRequest(request);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in POST /api/payments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleRefundRequest(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { paymentId, reason } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Find the payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { error: MESSAGES.PAYMENT_NOT_FOUND },
        { status: 404 }
      );
    }

    // Update payment status to refunded
    payment.status = 'Refunded';
    await payment.save();

    // Return success response
    return NextResponse.json(
      success({ paymentId: payment._id, status: 'Refunded' }, MESSAGES.PAYMENT_REFUNDED)
    );
  } catch (error) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}