import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/controllers/orderController';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await getAllOrders(search, status, page, limit);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['customerId', 'customerName', 'products', 'total'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate products array
    if (!Array.isArray(body.products) || body.products.length === 0) {
      return NextResponse.json(
        { error: 'Products must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate each product in the array
    for (const product of body.products) {
      if (!product.id || !product.name || typeof product.price !== 'number' || typeof product.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Each product must have id, name, price, and quantity' },
          { status: 400 }
        );
      }
    }

    // Ensure total is a number
    body.total = Number(body.total);

    const result = await createOrder(body);

    if (!result.success) {
      const status = result.error === 'Validation failed' ? 400 : 500;
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}