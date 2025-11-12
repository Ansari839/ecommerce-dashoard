import { connectDB } from '@/lib/db';
import Product, { IProduct } from '@/models/Product';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

export async function getAllProducts(search?: string) {
  try {
    await connectDB();

    let query = {};
    
    // If search term exists, add name/category search
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } }, // Case insensitive search in name
          { category: { $regex: search, $options: 'i' } } // Case insensitive search in category
        ]
      };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 });

    return success(products, MESSAGES.PRODUCTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function getProductById(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const product = await Product.findById(id);

    if (!product) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    return success(product, MESSAGES.PRODUCTS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching product:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function createProduct(productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectDB();

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    return success(savedProduct, MESSAGES.PRODUCT_CREATED);
  } catch (err: any) {
    console.error('Error creating product:', err);

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

export async function updateProduct(id: string, productData: Partial<IProduct>) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!updatedProduct) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    return success(updatedProduct, MESSAGES.PRODUCT_UPDATED);
  } catch (err: any) {
    console.error('Error updating product:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectDB();

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    return success(null, MESSAGES.PRODUCT_DELETED);
  } catch (err: any) {
    console.error('Error deleting product:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}