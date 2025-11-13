import { NextRequest, NextResponse } from 'next/server';
import {
  getPurchaseById,
  updatePurchase,
  deletePurchase
} from '@/controllers/purchaseController';
import { revalidatePath } from 'next/cache';
import { authorize } from '@/helpers/authorize';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the id from params
    const { id } = params;

    const result = await getPurchaseById(id);

    if (!result.success) {
      const status = result.error === 'Purchase not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/purchases/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization - only Admin, Finance, or Warehouse roles can update purchases
    const allowedRoles = ['Admin', 'Finance', 'Warehouse'];
    const authResult = authorize(request, allowedRoles);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;
    const body = await request.json();

    const result = await updatePurchase(id, body);

    if (!result.success) {
      const status =
        result.error === 'Purchase not found' || result.error === 'Invalid purchase ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the purchases page to reflect changes
    revalidatePath('/dashboard/purchases');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/purchases/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization - only Admin, Finance, or Warehouse roles can delete purchases
    const allowedRoles = ['Admin', 'Finance', 'Warehouse'];
    const authResult = authorize(request, allowedRoles);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;

    const result = await deletePurchase(id);

    if (!result.success) {
      const status = result.error === 'Purchase not found' || result.error === 'Invalid purchase ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the purchases page to reflect changes
    revalidatePath('/dashboard/purchases');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/purchases/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}