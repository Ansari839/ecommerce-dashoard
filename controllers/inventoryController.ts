import { connectDB } from '@/lib/db';
import Inventory, { IInventory } from '@/models/Inventory';
import Product from '@/models/Product'; // Import Product model for validation
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

/**
 * Get all inventory items with pagination, search, and filtering
 */
export async function getInventory(
  page: number = 1,
  limit: number = 10,
  searchQuery?: string
) {
  try {
    await connectDB();

    // Build query object
    let query: any = {};

    // Add text search if provided
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    // Calculate total count for pagination
    const total = await Inventory.countDocuments(query);

    // Get inventory items with pagination
    const inventoryItems = await Inventory.find(query)
      .populate('productId', 'name category price') // Populate product details
      .sort({ lastUpdated: -1 }) // Sort by last updated first
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      success: true,
      message: MESSAGES.INVENTORY_FETCHED,
      data: {
        inventory: inventoryItems,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    };
  } catch (err: any) {
    console.error('Error fetching inventory:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Get a specific inventory item by ID
 */
export async function getInventoryById(id: string) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: MESSAGES.INVALID_ID,
        error: 'Invalid ID format'
      };
    }

    const inventoryItem = await Inventory.findById(id)
      .populate('productId', 'name category price'); // Populate product details

    if (!inventoryItem) {
      return {
        success: false,
        message: MESSAGES.INVENTORY_NOT_FOUND,
        error: 'Inventory item not found'
      };
    }

    return {
      success: true,
      message: MESSAGES.INVENTORY_ITEM_FETCHED,
      data: inventoryItem
    };
  } catch (err: any) {
    console.error('Error fetching inventory item:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Create a new inventory item
 */
export async function addInventory(inventoryData: Omit<IInventory, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectDB();

    // Validate that the product exists
    const productExists = await Product.findById(inventoryData.productId);
    if (!productExists) {
      return {
        success: false,
        message: MESSAGES.PRODUCT_NOT_FOUND,
        error: 'Product not found'
      };
    }

    // Check if an inventory record already exists for this product
    const existingInventory = await Inventory.findOne({ productId: inventoryData.productId });
    if (existingInventory) {
      return {
        success: false,
        message: MESSAGES.INVENTORY_DUPLICATE_PRODUCT,
        error: 'Inventory record already exists for this product'
      };
    }

    const newInventory = new Inventory(inventoryData);
    const savedInventory = await newInventory.save();

    // Populate product information before returning
    const populatedInventory = await Inventory.findById(savedInventory._id)
      .populate('productId', 'name category price');

    return {
      success: true,
      message: MESSAGES.INVENTORY_CREATED,
      data: populatedInventory
    };
  } catch (err: any) {
    console.error('Error creating inventory item:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return {
        success: false,
        message: MESSAGES.VALIDATION_ERROR,
        error: 'Validation failed',
        details: errors
      };
    }

    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Update an existing inventory item
 */
export async function updateInventory(id: string, inventoryData: Partial<IInventory>) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: MESSAGES.INVALID_ID,
        error: 'Invalid ID format'
      };
    }

    // If updating product ID, validate the new product exists
    if (inventoryData.productId) {
      const productExists = await Product.findById(inventoryData.productId);
      if (!productExists) {
        return {
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
          error: 'Product not found'
        };
      }
    }

    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      { ...inventoryData, lastUpdated: new Date() }, // Update lastUpdated field
      { new: true, runValidators: true } // Return updated document and run validations
    ).populate('productId', 'name category price');

    if (!updatedInventory) {
      return {
        success: false,
        message: MESSAGES.INVENTORY_NOT_FOUND,
        error: 'Inventory item not found'
      };
    }

    return {
      success: true,
      message: MESSAGES.INVENTORY_UPDATED,
      data: updatedInventory
    };
  } catch (err: any) {
    console.error('Error updating inventory item:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return {
        success: false,
        message: MESSAGES.VALIDATION_ERROR,
        error: 'Validation failed',
        details: errors
      };
    }

    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Delete an inventory item
 */
export async function deleteInventory(id: string) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: MESSAGES.INVALID_ID,
        error: 'Invalid ID format'
      };
    }

    const deletedInventory = await Inventory.findByIdAndDelete(id);

    if (!deletedInventory) {
      return {
        success: false,
        message: MESSAGES.INVENTORY_NOT_FOUND,
        error: 'Inventory item not found'
      };
    }

    return {
      success: true,
      message: MESSAGES.INVENTORY_DELETED
    };
  } catch (err: any) {
    console.error('Error deleting inventory item:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}