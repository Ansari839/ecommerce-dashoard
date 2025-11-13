import { NextRequest, NextResponse } from 'next/server';
import { getAllShipping, createShipping } from '@/controllers/shippingController';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const courier = searchParams.get('courier') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await getAllShipping(search, status, courier, page, limit);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/shipping:', error);
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
    const requiredFields = [
      'orderId', 'customerId', 'customerName', 'address', 
      'courier', 'trackingNumber', 'estimatedDelivery', 'shippingCost'
    ];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate address fields
    if (!body.address.street || !body.address.city || !body.address.state || 
        !body.address.zipCode || !body.address.country) {
      return NextResponse.json(
        { error: 'Address must include street, city, state, zipCode, and country' },
        { status: 400 }
      );
    }

    // Validate shipping cost
    body.shippingCost = Number(body.shippingCost);
    if (isNaN(body.shippingCost) || body.shippingCost < 0) {
      return NextResponse.json(
        { error: 'Shipping cost must be a valid non-negative number' },
        { status: 400 }
      );
    }

    // Validate estimated delivery date
    if (body.estimatedDelivery) {
      body.estimatedDelivery = new Date(body.estimatedDelivery);
      if (isNaN(body.estimatedDelivery.getTime())) {
        return NextResponse.json(
          { error: 'Estimated delivery date must be a valid date' },
          { status: 400 }
        );
      }
    }

    // Validate status
    if (body.status && !['Pending', 'Shipped', 'Delivered', 'Returned'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Shipping status must be either Pending, Shipped, Delivered, or Returned' },
        { status: 400 }
      );
    }

    // Validate courier
    if (body.courier && !['FedEx', 'DHL', 'UPS'].includes(body.courier)) {
      return NextResponse.json(
        { error: 'Courier must be either FedEx, DHL, or UPS' },
        { status: 400 }
      );
    }

    const result = await createShipping(body);

    if (!result.success) {
      const status = result.error === 'Validation failed' ? 400 : 500;
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/shipping:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}