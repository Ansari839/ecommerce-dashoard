import { NextRequest, NextResponse } from 'next/server';
import {
  getPurchases,
  createPurchase,
  createPurchasesBulk
} from '@/controllers/purchaseController';
import { revalidatePath } from 'next/cache';
import { authorize } from '@/helpers/authorize';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    const result = await getPurchases(page, limit, search);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/purchases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization - only Admin, Finance, or Warehouse roles can create purchases
    const allowedRoles = ['Admin', 'Finance', 'Warehouse'];
    const authResult = authorize(request, allowedRoles);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 403 }
      );
    }

    const body = await request.json();
    const isBulk = new URL(request.url).searchParams.get('bulk') === 'true';
    
    // Check if we're doing a bulk create
    if (isBulk) {
      // Validate that body is an array
      if (!Array.isArray(body)) {
        return NextResponse.json(
          { error: 'Bulk create requires an array of purchases' },
          { status: 400 }
        );
      }
      
      // Validate required fields for each purchase in bulk
      for (const purchase of body) {
        const requiredFields = ['productId', 'quantity', 'supplier', 'price'];
        for (const field of requiredFields) {
          if (purchase[field] === undefined || purchase[field] === null || purchase[field] === '') {
            return NextResponse.json(
              { error: `${field} is required for each purchase in bulk create` },
              { status: 400 }
            );
          }
        }

        // Validate numeric fields
        if (typeof purchase.quantity !== 'number' || purchase.quantity < 1) {
          return NextResponse.json(
            { error: 'Quantity must be a number greater than 0' },
            { status: 400 }
          );
        }
        
        if (typeof purchase.price !== 'number' || purchase.price < 0) {
          return NextResponse.json(
            { error: 'Price must be a non-negative number' },
            { status: 400 }
          );
        }
      }
      
      const result = await createPurchasesBulk(body, body[0]?.updateInventory || false);
      
      if (!result.success) {
        const status = result.error === 'Validation failed' ? 400 : 500;
        return NextResponse.json(
          { error: result.error, details: result.details },
          { status }
        );
      }

      // Revalidate the purchases page to reflect changes
      revalidatePath('/dashboard/purchases');

      return NextResponse.json(result, { status: 201 });
    } else {
      // Regular single purchase creation
      const requiredFields = ['productId', 'quantity', 'supplier', 'price'];
      for (const field of requiredFields) {
        if (body[field] === undefined || body[field] === null || body[field] === '') {
          return NextResponse.json(
            { error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      // Validate numeric fields
      if (typeof body.quantity !== 'number' || body.quantity < 1) {
        return NextResponse.json(
          { error: 'Quantity must be a number greater than 0' },
          { status: 400 }
        );
      }
      
      if (typeof body.price !== 'number' || body.price < 0) {
        return NextResponse.json(
          { error: 'Price must be a non-negative number' },
          { status: 400 }
        );
      }

      const result = await createPurchase(
        {
          productId: body.productId,
          quantity: body.quantity,
          supplier: body.supplier,
          price: body.price,
          totalPrice: body.totalPrice,
          warehouseLocation: body.warehouseLocation,
          createdBy: body.createdBy,
          purchaseDate: body.purchaseDate || new Date()
        },
        body.updateInventory || false  // Check if inventory should be updated
      );

      if (!result.success) {
        const status = result.error === 'Validation failed' ? 400 : 500;
        return NextResponse.json(
          { error: result.error, details: result.details },
          { status }
        );
      }

      // Revalidate the purchases page to reflect changes
      revalidatePath('/dashboard/purchases');

      return NextResponse.json(result, { status: 201 });
    }
  } catch (error) {
    console.error('Error in POST /api/purchases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}