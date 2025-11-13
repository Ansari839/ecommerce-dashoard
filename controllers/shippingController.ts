import { connectDB } from '@/lib/db';
import Shipping, { IShipping } from '@/models/Shipping';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

export async function getAllShipping(search?: string, status?: string, courier?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();

    let query: any = {};
    
    // If search term exists, add search for shipment id, order id, customer name, or tracking number
    if (search) {
      query.$or = [
        { shipmentId: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    // If status filter exists, add it to the query
    if (status) {
      query.status = status;
    }
    
    // If courier filter exists, add it to the query
    if (courier) {
      query.courier = courier;
    }

    // Calculate the number of shipments to skip
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Shipping.countDocuments(query);
    
    // Get shipments for the current page
    const shipments = await Shipping.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date descending
      .skip(skip)
      .limit(limit);

    return success({
      shipments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalShipments: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      }
    }, MESSAGES.SHIPPING_FETCHED);
  } catch (err: any) {
    console.error('Error fetching shipments:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function getShippingById(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const shipping = await Shipping.findById(id);

    if (!shipping) {
      return error(MESSAGES.SHIPPING_NOT_FOUND);
    }

    return success(shipping, MESSAGES.SHIPPING_FETCHED);
  } catch (err: any) {
    console.error('Error fetching shipping:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function createShipping(shippingData: Omit<IShipping, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectDB();

    // Generate a unique shipment ID if not provided
    if (!shippingData.shipmentId) {
      // In a real application, you might want a more robust shipment ID generation
      shippingData.shipmentId = `SHIP-${Date.now()}`;
    }

    const newShipping = new Shipping(shippingData);
    const savedShipping = await newShipping.save();

    return success(savedShipping, MESSAGES.SHIPPING_CREATED);
  } catch (err: any) {
    console.error('Error creating shipping:', err);

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

export async function updateShipping(id: string, shippingData: Partial<IShipping>) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Update the shipping
    const updatedShipping = await Shipping.findByIdAndUpdate(
      id,
      shippingData,
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!updatedShipping) {
      return error(MESSAGES.SHIPPING_NOT_FOUND);
    }

    return success(updatedShipping, MESSAGES.SHIPPING_UPDATED);
  } catch (err: any) {
    console.error('Error updating shipping:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function deleteShipping(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedShipping = await Shipping.findByIdAndDelete(id);

    if (!deletedShipping) {
      return error(MESSAGES.SHIPPING_NOT_FOUND);
    }

    return success(null, MESSAGES.SHIPPING_DELETED);
  } catch (err: any) {
    console.error('Error deleting shipping:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}