import { NextRequest, NextResponse } from 'next/server';
import { 
  getInventoryById, 
  updateInventory, 
  deleteInventory 
} from '@/controllers/inventoryController';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the id from params
    const { id } = params;

    const result = await getInventoryById(id);

    if (!result.success) {
      const status = result.error === 'Inventory not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/inventory/[id]:', error);
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
    // Extract the id from params
    const { id } = params;
    const body = await request.json();

    const result = await updateInventory(id, body);

    if (!result.success) {
      const status =
        result.error === 'Inventory not found' || result.error === 'Invalid inventory ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the inventory page to reflect changes
    revalidatePath('/dashboard/inventory');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/inventory/[id]:', error);
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
    // Extract the id from params
    const { id } = params;

    const result = await deleteInventory(id);

    if (!result.success) {
      const status = result.error === 'Inventory not found' || result.error === 'Invalid inventory ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the inventory page to reflect changes
    revalidatePath('/dashboard/inventory');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/inventory/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}