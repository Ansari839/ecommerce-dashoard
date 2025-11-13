import { NextRequest, NextResponse } from 'next/server';
import { deletePayment, getPaymentById, updatePayment } from '@/controllers/paymentController';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to properly extract the id
    const { id } = await params;

    const result = await getPaymentById(id);

    if (!result.success) {
      const status = result.error === 'Payment not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/payments/[id]:', error);
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

    const result = await updatePayment(id, body);

    if (!result.success) {
      const status =
        result.error === 'Payment not found' || result.error === 'Invalid payment ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the payments page to reflect changes
    revalidatePath('/dashboard/payments');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/payments/[id]:', error);
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

    const result = await deletePayment(id);

    if (!result.success) {
      const status = result.error === 'Payment not found' || result.error === 'Invalid payment ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the payments page to reflect changes
    revalidatePath('/dashboard/payments');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/payments/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}