import { connectDB } from '@/lib/db';
import Order, { IOrder } from '@/models/Order';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

export async function getAllOrders(search?: string, status?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();

    let query: any = {};
    
    // If search term exists, add search for order id, customer name, or product names
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { 'products.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    // If status filter exists, add it to the query
    if (status) {
      query.status = status;
    }

    // Calculate the number of orders to skip
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Order.countDocuments(query);
    
    // Get orders for the current page
    const orders = await Order.find(query)
      .sort({ date: -1 }) // Sort by date descending
      .skip(skip)
      .limit(limit);

    return success({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      }
    }, MESSAGES.ORDERS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function getOrderById(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const order = await Order.findById(id);

    if (!order) {
      return error(MESSAGES.ORDER_NOT_FOUND);
    }

    return success(order, MESSAGES.ORDER_FETCHED);
  } catch (err: any) {
    console.error('Error fetching order:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function createOrder(orderData: Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectDB();

    // Generate a unique order ID if not provided
    if (!orderData.orderId) {
      // In a real application, you might want a more robust order ID generation
      orderData.orderId = `ORD-${Date.now()}`;
    }

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    return success(savedOrder, MESSAGES.ORDER_CREATED);
  } catch (err: any) {
    console.error('Error creating order:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function updateOrder(id: string, orderData: Partial<IOrder>) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      orderData,
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!updatedOrder) {
      return error(MESSAGES.ORDER_NOT_FOUND);
    }

    return success(updatedOrder, MESSAGES.ORDER_UPDATED);
  } catch (err: any) {
    console.error('Error updating order:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function deleteOrder(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return error(MESSAGES.ORDER_NOT_FOUND);
    }

    return success(null, MESSAGES.ORDER_DELETED);
  } catch (err: any) {
    console.error('Error deleting order:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}