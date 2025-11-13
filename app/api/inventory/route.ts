import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllInventory, 
  createInventory 
} from '@/controllers/inventoryController';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const minStock = searchParams.get('minStock') ? parseInt(searchParams.get('minStock') || '0') : undefined;
    const warehouseLocation = searchParams.get('warehouseLocation') || undefined;

    const result = await getAllInventory(page, limit, minStock, warehouseLocation);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/inventory:', error);
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
    const requiredFields = ['productId', 'stock', 'warehouseLocation'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate stock is a number
    if (typeof body.stock !== 'number' || body.stock < 0) {
      return NextResponse.json(
        { error: 'Stock must be a non-negative number' },
        { status: 400 }
      );
    }

    // Validate warehouse location is a string
    if (typeof body.warehouseLocation !== 'string' || body.warehouseLocation.trim() === '') {
      return NextResponse.json(
        { error: 'Warehouse location must be a non-empty string' },
        { status: 400 }
      );
    }

    const result = await createInventory(body);

    if (!result.success) {
      const status = result.error === 'Validation failed' ? 400 : 500;
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the inventory page to reflect changes
    revalidatePath('/dashboard/inventory');

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/inventory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}