import { NextRequest, NextResponse } from 'next/server';
import { deleteShipping, getShippingById, updateShipping } from '@/controllers/shippingController';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to properly extract the id
    const { id } = await params;

    const result = await getShippingById(id);

    if (!result.success) {
      const status = result.error === 'Shipping not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/shipping/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to properly extract the id
    const { id } = await params;
    const body = await request.json();

    // Validate status if provided
    if (body.status && !['Pending', 'Shipped', 'Delivered', 'Returned'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Shipping status must be either Pending, Shipped, Delivered, or Returned' },
        { status: 400 }
      );
    }

    const result = await updateShipping(id, body);

    if (!result.success) {
      const status =
        result.error === 'Shipping not found' || result.error === 'Invalid shipping ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the shipping page to reflect changes
    revalidatePath('/dashboard/shipping');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/shipping/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to properly extract the id
    const { id } = await params;

    const result = await deleteShipping(id);

    if (!result.success) {
      const status = result.error === 'Shipping not found' || result.error === 'Invalid shipping ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the shipping page to reflect changes
    revalidatePath('/dashboard/shipping');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/shipping/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}