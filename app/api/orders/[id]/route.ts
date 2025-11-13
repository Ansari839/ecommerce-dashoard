import { NextRequest, NextResponse } from 'next/server';
import { deleteOrder, getOrderById, updateOrder } from '@/controllers/orderController';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to properly extract the id
    const { id } = await params;

    const result = await getOrderById(id);

    if (!result.success) {
      const status = result.error === 'Order not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/orders/[id]:', error);
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

    const result = await updateOrder(id, body);

    if (!result.success) {
      const status =
        result.error === 'Order not found' || result.error === 'Invalid order ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the orders page to reflect changes
    revalidatePath('/dashboard/orders');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/orders/[id]:', error);
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

    const result = await deleteOrder(id);

    if (!result.success) {
      const status = result.error === 'Order not found' || result.error === 'Invalid order ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the orders page to reflect changes
    revalidatePath('/dashboard/orders');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/orders/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}