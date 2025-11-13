import { connectDB } from '@/lib/db';
import Inventory, { IInventory } from '@/models/Inventory';
import Product from '@/models/Product'; // Import Product model for validation
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

/**
 * Get all inventory items with optional filters
 */
export async function getAllInventory(
  page: number = 1,
  limit: number = 10,
  minStock?: number,
  warehouseLocation?: string
) {
  try {
    await connectDB();

    // Build query object
    let query: any = {};

    // Add filters if provided
    if (minStock !== undefined) {
      query.stock = { $gte: minStock };
    }

    if (warehouseLocation) {
      query.warehouseLocation = { $regex: warehouseLocation, $options: 'i' };
    }

    // Calculate total count for pagination
    const total = await Inventory.countDocuments(query);

    // Get inventory items with pagination
    const inventoryItems = await Inventory.find(query)
      .populate('productId', 'name category price') // Populate product details
      .sort({ lastUpdated: -1 }) // Sort by last updated first
      .skip((page - 1) * limit)
      .limit(limit);

    return success({
      inventory: inventoryItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, MESSAGES.INVENTORY_FETCHED);
  } catch (err: any) {
    console.error('Error fetching inventory:', err);
    return error(MESSAGES.INTERNAL_ERROR);
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
      return error(MESSAGES.INVALID_ID);
    }

    const inventoryItem = await Inventory.findById(id)
      .populate('productId', 'name category price'); // Populate product details

    if (!inventoryItem) {
      return error(MESSAGES.INVENTORY_NOT_FOUND);
    }

    return success(inventoryItem, MESSAGES.INVENTORY_ITEM_FETCHED);
  } catch (err: any) {
    console.error('Error fetching inventory item:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Create a new inventory item
 */
export async function createInventory(inventoryData: Omit<IInventory, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectDB();

    // Validate that the product exists
    const productExists = await Product.findById(inventoryData.productId);
    if (!productExists) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    // Check if an inventory record already exists for this product
    const existingInventory = await Inventory.findOne({ productId: inventoryData.productId });
    if (existingInventory) {
      return error(MESSAGES.INVENTORY_DUPLICATE_PRODUCT);
    }

    const newInventory = new Inventory(inventoryData);
    const savedInventory = await newInventory.save();

    // Populate product information before returning
    const populatedInventory = await Inventory.findById(savedInventory._id)
      .populate('productId', 'name category price');

    return success(populatedInventory, MESSAGES.INVENTORY_CREATED);
  } catch (err: any) {
    console.error('Error creating inventory item:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return error(MESSAGES.VALIDATION_ERROR, errors);
    }

    return error(MESSAGES.INTERNAL_ERROR);
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
      return error(MESSAGES.INVALID_ID);
    }

    // If updating product ID, validate the new product exists
    if (inventoryData.productId) {
      const productExists = await Product.findById(inventoryData.productId);
      if (!productExists) {
        return error(MESSAGES.PRODUCT_NOT_FOUND);
      }
    }

    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      { ...inventoryData, lastUpdated: new Date() }, // Update lastUpdated field
      { new: true, runValidators: true } // Return updated document and run validations
    ).populate('productId', 'name category price');

    if (!updatedInventory) {
      return error(MESSAGES.INVENTORY_NOT_FOUND);
    }

    return success(updatedInventory, MESSAGES.INVENTORY_UPDATED);
  } catch (err: any) {
    console.error('Error updating inventory item:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return error(MESSAGES.VALIDATION_ERROR, errors);
    }

    return error(MESSAGES.INTERNAL_ERROR);
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
      return error(MESSAGES.INVALID_ID);
    }

    const deletedInventory = await Inventory.findByIdAndDelete(id);

    if (!deletedInventory) {
      return error(MESSAGES.INVENTORY_NOT_FOUND);
    }

    return success(null, MESSAGES.INVENTORY_DELETED);
  } catch (err: any) {
    console.error('Error deleting inventory item:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Update stock level for a product
 */
export async function updateStock(productId: string, stockChange: number) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return error(MESSAGES.INVALID_ID);
    }

    const inventoryRecord = await Inventory.findOne({ productId });

    if (!inventoryRecord) {
      // If no inventory record exists, create one
      const newInventoryData = {
        productId,
        stock: Math.max(0, stockChange), // Don't allow negative stock
        warehouseLocation: 'Main Warehouse', // Default location if creating new item
        lastUpdated: new Date()
      };

      const newInventory = new Inventory(newInventoryData);
      const savedInventory = await newInventory.save();

      return success(savedInventory, MESSAGES.STOCK_UPDATED);
    }

    // Update existing inventory
    const newStock = Math.max(0, inventoryRecord.stock + stockChange); // Don't allow negative stock
    const updatedInventory = await Inventory.findOneAndUpdate(
      { productId },
      {
        stock: newStock,
        lastUpdated: new Date()
      },
      { new: true } // Return updated document
    ).populate('productId', 'name category price');

    return success(updatedInventory, MESSAGES.STOCK_UPDATED);
  } catch (err: any) {
    console.error('Error updating stock:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}