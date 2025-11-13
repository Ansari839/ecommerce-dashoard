import { connectDB } from '@/lib/db';
import Customer, { ICustomer } from '@/models/Customer';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

export async function getAllCustomers(search?: string, status?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();

    let query: any = {};
    
    // If search term exists, add search for customer id, name, or email
    if (search) {
      query.$or = [
        { customerId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // If status filter exists, add it to the query
    if (status) {
      query.status = status;
    }

    // Calculate the number of customers to skip
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Customer.countDocuments(query);
    
    // Get customers for the current page
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date descending
      .skip(skip)
      .limit(limit);

    return success({
      customers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCustomers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      }
    }, MESSAGES.CUSTOMERS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching customers:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function getCustomerById(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const customer = await Customer.findById(id);

    if (!customer) {
      return error(MESSAGES.CUSTOMER_NOT_FOUND);
    }

    return success(customer, MESSAGES.CUSTOMER_FETCHED);
  } catch (err: any) {
    console.error('Error fetching customer:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function createCustomer(customerData: Omit<ICustomer, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectDB();

    // Generate a unique customer ID if not provided
    if (!customerData.customerId) {
      // In a real application, you might want a more robust customer ID generation
      customerData.customerId = `CUST-${Date.now()}`;
    }

    const newCustomer = new Customer(customerData);
    const savedCustomer = await newCustomer.save();

    return success(savedCustomer, MESSAGES.CUSTOMER_CREATED);
  } catch (err: any) {
    console.error('Error creating customer:', err);

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

export async function updateCustomer(id: string, customerData: Partial<ICustomer>) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Update the customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      customerData,
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!updatedCustomer) {
      return error(MESSAGES.CUSTOMER_NOT_FOUND);
    }

    return success(updatedCustomer, MESSAGES.CUSTOMER_UPDATED);
  } catch (err: any) {
    console.error('Error updating customer:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function deleteCustomer(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return error(MESSAGES.CUSTOMER_NOT_FOUND);
    }

    return success(null, MESSAGES.CUSTOMER_DELETED);
  } catch (err: any) {
    console.error('Error deleting customer:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}