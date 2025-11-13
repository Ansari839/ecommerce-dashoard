import { NextRequest, NextResponse } from 'next/server';
import { deleteCustomer, getCustomerById, updateCustomer } from '@/controllers/customerController';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to properly extract the id
    const { id } = await params;

    const result = await getCustomerById(id);

    if (!result.success) {
      const status = result.error === 'Customer not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/customers/[id]:', error);
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

    const result = await updateCustomer(id, body);

    if (!result.success) {
      const status =
        result.error === 'Customer not found' || result.error === 'Invalid customer ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the customers page to reflect changes
    revalidatePath('/dashboard/customers');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/customers/[id]:', error);
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

    const result = await deleteCustomer(id);

    if (!result.success) {
      const status = result.error === 'Customer not found' || result.error === 'Invalid customer ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the customers page to reflect changes
    revalidatePath('/dashboard/customers');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/customers/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}