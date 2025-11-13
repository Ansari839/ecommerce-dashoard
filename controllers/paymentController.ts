import { connectDB } from '@/lib/db';
import Payment, { IPayment } from '@/models/Payment';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

export async function getAllPayments(search?: string, status?: string, method?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();

    let query: any = {};
    
    // If search term exists, add search for payment id, order id, customer name, or transaction id
    if (search) {
      query.$or = [
        { paymentId: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } }
      ];
    }
    
    // If status filter exists, add it to the query
    if (status) {
      query.status = status;
    }
    
    // If method filter exists, add it to the query
    if (method) {
      query.method = method;
    }

    // Calculate the number of payments to skip
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Payment.countDocuments(query);
    
    // Get payments for the current page
    const payments = await Payment.find(query)
      .sort({ date: -1 }) // Sort by date descending
      .skip(skip)
      .limit(limit);

    return success({
      payments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPayments: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      }
    }, MESSAGES.PAYMENTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching payments:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function getPaymentById(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      return error(MESSAGES.PAYMENT_NOT_FOUND);
    }

    return success(payment, MESSAGES.PAYMENT_FETCHED);
  } catch (err: any) {
    console.error('Error fetching payment:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function createPayment(paymentData: Omit<IPayment, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectDB();

    // Generate a unique payment ID if not provided
    if (!paymentData.paymentId) {
      // In a real application, you might want a more robust payment ID generation
      paymentData.paymentId = `PAY-${Date.now()}`;
    }

    const newPayment = new Payment(paymentData);
    const savedPayment = await newPayment.save();

    return success(savedPayment, MESSAGES.PAYMENT_CREATED);
  } catch (err: any) {
    console.error('Error creating payment:', err);

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

export async function updatePayment(id: string, paymentData: Partial<IPayment>) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Update the payment
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      paymentData,
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!updatedPayment) {
      return error(MESSAGES.PAYMENT_NOT_FOUND);
    }

    return success(updatedPayment, MESSAGES.PAYMENT_UPDATED);
  } catch (err: any) {
    console.error('Error updating payment:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function deletePayment(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return error(MESSAGES.PAYMENT_NOT_FOUND);
    }

    return success(null, MESSAGES.PAYMENT_DELETED);
  } catch (err: any) {
    console.error('Error deleting payment:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}