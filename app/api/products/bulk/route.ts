import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import { connectDB } from '@/lib/db';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import { revalidatePath } from 'next/cache';
import { authenticateRequest, checkPermission } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // Check authorization for bulk product creation
    const allowedRoles = ['Admin', 'Manager'];
    const hasPermission = await checkPermission(authResult.user, 'products', 'create', allowedRoles);
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate that the body is an array
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: MESSAGES.BULK_REQUEST_MUST_BE_ARRAY },
        { status: 400 }
      );
    }

    // Validate the number of products (15-20 as per requirements)
    if (body.length < 15 || body.length > 20) {
      return NextResponse.json(
        { error: MESSAGES.BULK_PRODUCTS_COUNT_REQUIREMENT },
        { status: 400 }
      );
    }

    await connectDB();

    // Validate each product object
    const validationErrors: { index: number; error: string }[] = [];
    const validProducts = [];

    for (let i = 0; i < body.length; i++) {
      const product = body[i];
      const validationError = validateProduct(product);

      if (validationError) {
        validationErrors.push({ index: i, error: validationError });
      } else {
        validProducts.push(product);
      }
    }

    // If all products failed validation, return error
    if (validProducts.length === 0) {
      return NextResponse.json(
        error(MESSAGES.BULK_PRODUCTS_VALIDATION_FAILED, { validationErrors }),
        { status: 400 }
      );
    }

    // If some products failed validation, log warnings
    if (validationErrors.length > 0) {
      console.warn(`Bulk product upload: ${validationErrors.length} products failed validation`, validationErrors);
    }

    // Create products in bulk
    const createdProducts = [];
    const creationErrors = [];

    for (let i = 0; i < validProducts.length; i++) {
      try {
        const productData = validProducts[i];
        const newProduct = new Product({
          name: productData.name,
          category: productData.category,
          price: productData.price,
          stock: productData.stock,
          status: productData.status || 'active',
          image: productData.image
        });

        const savedProduct = await newProduct.save();
        createdProducts.push(savedProduct);
      } catch (err: any) {
        console.error(`Error creating product:`, validProducts[i], err);
        creationErrors.push({
          product: validProducts[i],
          error: err.message
        });
      }
    }

    // Revalidate the products page to reflect changes
    revalidatePath('/dashboard/products');

    // Return result based on success/error ratio
    if (creationErrors.length > 0 && createdProducts.length === 0) {
      // All creations failed
      return NextResponse.json(
        error(MESSAGES.BULK_PRODUCTS_CREATION_FAILED),
        { status: 500 }
      );
    } else if (creationErrors.length > 0) {
      // Some succeeded, some failed
      console.warn(`Bulk creation partial success: ${createdProducts.length} created, ${creationErrors.length} failed`);
      return NextResponse.json(
        success({
          createdProducts,
          failureCount: creationErrors.length,
          errorDetails: creationErrors
        }, MESSAGES.BULK_PRODUCTS_PARTIAL_SUCCESS)
      );
    } else {
      // All succeeded
      return NextResponse.json(
        success(createdProducts, MESSAGES.BULK_PRODUCTS_CREATED)
      );
    }
  } catch (err: any) {
    console.error('Error in bulk product creation API:', err);
    return NextResponse.json(
      error(MESSAGES.INTERNAL_ERROR),
      { status: 500 }
    );
  }
}

/**
 * Validates a single product object
 */
function validateProduct(product: any): string | null {
  if (!product) {
    return 'Product is required';
  }

  // Validate required fields
  if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
    return 'Product name is required and must be a non-empty string';
  }

  if (!product.category || typeof product.category !== 'string' || product.category.trim() === '') {
    return 'Product category is required and must be a non-empty string';
  }

  // Validate price
  if (typeof product.price !== 'number' || product.price <= 0) {
    return 'Product price is required and must be a positive number';
  }

  // Validate stock
  if (typeof product.stock !== 'number' || product.stock < 0 || !Number.isInteger(product.stock)) {
    return 'Product stock is required and must be a non-negative integer';
  }

  // Validate status if present
  if (product.status && !['active', 'inactive', 'discontinued'].includes(product.status)) {
    return 'Product status must be one of: active, inactive, discontinued';
  }

  // Validate image URL if present
  if (product.image && typeof product.image !== 'string') {
    return 'Product image must be a string URL';
  }

  return null;
}