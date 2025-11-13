import { connectDB } from '@/lib/db';
import Purchase, { IPurchase } from '@/models/Purchase';
import Product from '@/models/Product'; // Import Product model for validation
import Inventory from '@/models/Inventory'; // Import Inventory model for updates
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

/**
 * Get all purchases with pagination
 */
export async function getPurchases(
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
    const total = await Purchase.countDocuments(query);

    // Get purchases with pagination
    const purchases = await Purchase.find(query)
      .populate('productId', 'name category price') // Populate product details
      .populate('createdBy', 'name email') // Populate creator details
      .sort({ purchaseDate: -1 }) // Sort by purchase date descending
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      success: true,
      message: MESSAGES.PURCHASES_FETCHED,
      data: {
        purchases,
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
    console.error('Error fetching purchases:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Get a specific purchase by ID
 */
export async function getPurchaseById(id: string) {
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

    const purchase = await Purchase.findById(id)
      .populate('productId', 'name category price') // Populate product details
      .populate('createdBy', 'name email'); // Populate creator details

    if (!purchase) {
      return {
        success: false,
        message: MESSAGES.PURCHASE_NOT_FOUND,
        error: 'Purchase not found'
      };
    }

    return {
      success: true,
      message: MESSAGES.PURCHASE_ITEM_FETCHED,
      data: purchase
    };
  } catch (err: any) {
    console.error('Error fetching purchase:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Create a new purchase
 */
export async function createPurchase(
  purchaseData: Omit<IPurchase, '_id' | 'createdAt' | 'updatedAt' | 'totalPrice'>,
  updateInventory: boolean = false
) {
  try {
    await connectDB();

    // Validate that the product exists
    const productExists = await Product.findById(purchaseData.productId);
    if (!productExists) {
      return {
        success: false,
        message: MESSAGES.PRODUCT_NOT_FOUND,
        error: 'Product not found'
      };
    }

    // Calculate total price if not provided
    if (!purchaseData.totalPrice && purchaseData.quantity && purchaseData.price) {
      purchaseData.totalPrice = purchaseData.quantity * purchaseData.price;
    }

    const newPurchase = new Purchase(purchaseData);
    const savedPurchase = await newPurchase.save();

    // Optionally update inventory
    if (updateInventory) {
      await Inventory.updateOne(
        { productId: purchaseData.productId },
        {
          $inc: { stock: purchaseData.quantity }, // Increase stock by quantity purchased
          $set: { lastUpdated: new Date() }
        },
        { upsert: true } // Create inventory record if it doesn't exist
      );
    }

    // Add ledger entry hook placeholder
    await addLedgerEntryForPurchase(savedPurchase);

    // Populate product and creator information before returning
    const populatedPurchase = await Purchase.findById(savedPurchase._id)
      .populate('productId', 'name category price')
      .populate('createdBy', 'name email');

    return {
      success: true,
      message: MESSAGES.PURCHASE_CREATED,
      data: populatedPurchase
    };
  } catch (err: any) {
    console.error('Error creating purchase:', err);

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
 * Bulk create purchases
 */
export async function createPurchasesBulk(
  purchasesData: Omit<IPurchase, '_id' | 'createdAt' | 'updatedAt' | 'totalPrice'>[],
  updateInventory: boolean = false
) {
  try {
    await connectDB();

    const results: any[] = [];
    for (const purchaseData of purchasesData) {
      // Validate that the product exists
      const productExists = await Product.findById(purchaseData.productId);
      if (!productExists) {
        results.push({
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
          error: `Product not found for ID: ${purchaseData.productId}`
        });
        continue;
      }

      // Calculate total price if not provided
      if (!purchaseData.totalPrice && purchaseData.quantity && purchaseData.price) {
        purchaseData.totalPrice = purchaseData.quantity * purchaseData.price;
      }

      const newPurchase = new Purchase(purchaseData);
      const savedPurchase = await newPurchase.save();

      // Optionally update inventory
      if (updateInventory) {
        await Inventory.updateOne(
          { productId: purchaseData.productId },
          {
            $inc: { stock: purchaseData.quantity }, // Increase stock by quantity purchased
            $set: { lastUpdated: new Date() }
          },
          { upsert: true } // Create inventory record if it doesn't exist
        );
      }

      // Add ledger entry hook placeholder
      await addLedgerEntryForPurchase(savedPurchase);

      // Populate product and creator information before returning
      const populatedPurchase = await Purchase.findById(savedPurchase._id)
        .populate('productId', 'name category price')
        .populate('createdBy', 'name email');

      results.push({
        success: true,
        message: MESSAGES.PURCHASE_CREATED,
        data: populatedPurchase
      });
    }

    return {
      success: true,
      message: MESSAGES.PURCHASES_BULK_CREATED,
      data: results
    };
  } catch (err: any) {
    console.error('Error creating purchases in bulk:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Update an existing purchase
 */
export async function updatePurchase(id: string, purchaseData: Partial<IPurchase>) {
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
    if (purchaseData.productId) {
      const productExists = await Product.findById(purchaseData.productId);
      if (!productExists) {
        return {
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
          error: 'Product not found'
        };
      }
    }

    // Calculate total price if not provided and both quantity and price are updated
    if (
      !purchaseData.totalPrice && 
      purchaseData.quantity !== undefined && 
      purchaseData.price !== undefined
    ) {
      purchaseData.totalPrice = purchaseData.quantity * purchaseData.price;
    }

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id,
      purchaseData,
      { new: true, runValidators: true } // Return updated document and run validations
    )
      .populate('productId', 'name category price') // Populate product details
      .populate('createdBy', 'name email'); // Populate creator details

    if (!updatedPurchase) {
      return {
        success: false,
        message: MESSAGES.PURCHASE_NOT_FOUND,
        error: 'Purchase not found'
      };
    }

    return {
      success: true,
      message: MESSAGES.PURCHASE_UPDATED,
      data: updatedPurchase
    };
  } catch (err: any) {
    console.error('Error updating purchase:', err);

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
 * Delete a purchase
 */
export async function deletePurchase(id: string) {
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

    const deletedPurchase = await Purchase.findByIdAndDelete(id);

    if (!deletedPurchase) {
      return {
        success: false,
        message: MESSAGES.PURCHASE_NOT_FOUND,
        error: 'Purchase not found'
      };
    }

    return {
      success: true,
      message: MESSAGES.PURCHASE_DELETED
    };
  } catch (err: any) {
    console.error('Error deleting purchase:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Placeholder function for ledger entry hook
 */
async function addLedgerEntryForPurchase(purchase: IPurchase) {
  // This function would connect to a P&L module to record the purchase transaction
  // Implementation details would depend on the specific accounting/ledger system used
  console.log(`Ledger entry hook for purchase ${purchase._id} - Amount: ${purchase.totalPrice || (purchase.quantity * purchase.price)}`);
  
  // This is a placeholder - in a real application, this would:
  // - Create an entry in a ledger/transaction system
  // - Update financial records
  // - Potentially trigger other business processes
}