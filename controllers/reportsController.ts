import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import Shipping from '@/models/Shipping';
import Payment from '@/models/Payment';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';

// Get sales data (total revenue, orders, etc.)
export async function getSalesData(startDate?: string, endDate?: string, category?: string) {
  try {
    await connectDB();

    const matchStage: any = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Add category filter if provided
    if (category) {
      matchStage.category = category;
    }

    // Aggregation pipeline to get sales data
    const salesData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$total' }
        }
      }
    ]);

    const result = salesData.length > 0 ? salesData[0] : {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0
    };

    return success(result, MESSAGES.REPORTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching sales data:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get revenue over time (sales trend)
export async function getRevenueOverTime(startDate?: string, endDate?: string, category?: string) {
  try {
    await connectDB();

    const matchStage: any = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Add category filter if provided
    if (category) {
      // This assumes we'll join with products to filter by category
      // For demonstration purposes, we'll aggregate by date
    }

    // Aggregation pipeline to get revenue over time
    const revenueData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalRevenue: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    return success(revenueData, MESSAGES.REPORTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching revenue over time:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get top products
export async function getTopProducts(startDate?: string, endDate?: string, category?: string) {
  try {
    await connectDB();

    const matchStage: any = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Aggregation pipeline to get top products
    const productSales = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.name",
          totalQuantity: { $sum: "$products.quantity" },
          totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    return success(productSales, MESSAGES.REPORTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching top products:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get customer analytics
export async function getCustomerAnalytics(startDate?: string, endDate?: string) {
  try {
    await connectDB();

    const matchStage: any = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Aggregation pipeline to get customer analytics
    const customerData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$customerId",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          lastOrderDate: { $max: "$createdAt" }
        }
      },
      {
        $group: {
          _id: null,
          customerCount: { $sum: 1 },
          avgOrderCount: { $avg: "$orderCount" },
          avgTotalSpent: { $avg: "$totalSpent" },
          totalRevenue: { $sum: "$totalSpent" }
        }
      }
    ]);

    const result = customerData.length > 0 ? customerData[0] : {
      customerCount: 0,
      avgOrderCount: 0,
      avgTotalSpent: 0,
      totalRevenue: 0
    };

    // Get new customers in period
    const newCustomers = await Customer.countDocuments({
      ...(startDate && { createdAt: { $gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { $lte: new Date(endDate) } })
    });

    // Get returning customers by checking if they had orders before the period
    const allCustomersInPeriod = await Order.distinct('customerId', matchStage);
    const returningCustomerIds = await Customer.find({
      _id: { $in: allCustomersInPeriod },
      ...(startDate && { createdAt: { $lt: new Date(startDate) } })
    }).distinct('_id');

    return success({
      ...result,
      newCustomers,
      returningCustomers: returningCustomerIds.length
    }, MESSAGES.REPORTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching customer analytics:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get inventory insights
export async function getInventoryInsights() {
  try {
    await connectDB();

    // Get products with low stock (less than 10)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name category price stock status')
      .limit(10);

    // Get total products and categories
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Product.distinct('category');

    return success({
      totalProducts,
      totalCategories: totalCategories.length,
      lowStockProducts,
      lowStockCount: lowStockProducts.length
    }, MESSAGES.REPORTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching inventory insights:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get payment method distribution
export async function getPaymentDistribution(startDate?: string, endDate?: string) {
  try {
    await connectDB();

    const matchStage: any = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Aggregation pipeline to get payment distribution
    const paymentDistribution = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$method",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    // Get failed/pending payments
    const statusCounts = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    return success({
      paymentDistribution,
      statusCounts
    }, MESSAGES.REPORTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching payment distribution:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get shipping performance
export async function getShippingPerformance(startDate?: string, endDate?: string) {
  try {
    await connectDB();

    const matchStage: any = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Aggregation pipeline to get shipping performance
    const shippingData = await Shipping.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$courier",
          count: { $sum: 1 },
          avgDeliveryTime: { $avg: { $subtract: ["$actualDelivery", "$estimatedDelivery"] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Shipped"] }, 1, 0] } }
        }
      }
    ]);

    // Get pending/failed shipments
    const pendingShipments = await Shipping.countDocuments({
      status: { $in: ['Shipped', 'Pending'] },
      ...(startDate && { createdAt: { $gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { $lte: new Date(endDate) } })
    });

    return success({
      shippingData,
      pendingShipments
    }, MESSAGES.REPORTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching shipping performance:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get refunds and returns
export async function getRefundsData(startDate?: string, endDate?: string) {
  try {
    await connectDB();

    const matchStage: any = { status: 'Returned' }; // Filter for returned orders

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Aggregation pipeline to get refunds data
    const refundData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRefunds: { $sum: 1 },
          totalRefundAmount: { $sum: '$total' },
          avgRefundAmount: { $avg: '$total' }
        }
      }
    ]);

    return success(refundData.length > 0 ? refundData[0] : {
      totalRefunds: 0,
      totalRefundAmount: 0,
      avgRefundAmount: 0
    }, MESSAGES.REPORTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching refunds data:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}