import { dbConnect } from '@/lib/db';
import Product, { IProduct } from '@/lib/models/Product';
import mongoose from 'mongoose';

// Connect to the database and return the Product model
async function connectAndReturnModel() {
  await dbConnect();
  return Product;
}

// Get all products
export async function getAllProducts(page: number = 1, limit: number = 10, search?: string) {
  try {
    const ProductModel = await connectAndReturnModel();
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const products = await ProductModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await ProductModel.countDocuments(query);
    
    return {
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get product by ID
export async function getProductById(id: string) {
  try {
    const ProductModel = await connectAndReturnModel();
    
    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: 'Invalid product ID'
      };
    }
    
    const product = await ProductModel.findById(id);
    
    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }
    
    return {
      success: true,
      data: product
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Create a new product
export async function createProduct(productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    const ProductModel = await connectAndReturnModel();
    
    // Create the new product
    const newProduct = new ProductModel(productData);
    const savedProduct = await newProduct.save();
    
    return {
      success: true,
      data: savedProduct,
      message: 'Product created successfully'
    };
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors: Record<string, string> = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      
      return {
        success: false,
        error: 'Validation failed',
        details: errors
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Update a product
export async function updateProduct(id: string, productData: Partial<IProduct>) {
  try {
    const ProductModel = await connectAndReturnModel();
    
    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: 'Invalid product ID'
      };
    }
    
    // Update the product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      productData,
      { new: true, runValidators: true } // Return the updated document and run validations
    );
    
    if (!updatedProduct) {
      return {
        success: false,
        error: 'Product not found'
      };
    }
    
    return {
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    };
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors: Record<string, string> = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      
      return {
        success: false,
        error: 'Validation failed',
        details: errors
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const ProductModel = await connectAndReturnModel();
    
    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: 'Invalid product ID'
      };
    }
    
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return {
        success: false,
        error: 'Product not found'
      };
    }
    
    return {
      success: true,
      message: 'Product deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}