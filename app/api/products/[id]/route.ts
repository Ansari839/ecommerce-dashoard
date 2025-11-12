import { NextRequest, NextResponse } from 'next/server';
import { deleteProduct, getProductById, updateProduct } from '@/controllers/productController';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to properly extract the id
    const { id } = await params;

    const result = await getProductById(id);

    if (!result.success) {
      const status = result.error === 'Product not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error);
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

    // Validate numeric fields (price and stock)
    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || isNaN(body.price) || body.price < 0) {
        return NextResponse.json(
          { error: 'Price must be a valid non-negative number' },
          { status: 400 }
        );
      }
    }
    
    if (body.stock !== undefined) {
      if (typeof body.stock !== 'number' || isNaN(body.stock) || body.stock < 0) {
        return NextResponse.json(
          { error: 'Stock must be a valid non-negative number' },
          { status: 400 }
        );
      }
    }

    const result = await updateProduct(id, body);

    if (!result.success) {
      const status =
        result.error === 'Product not found' || result.error === 'Invalid product ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the products page to reflect changes
    revalidatePath('/dashboard/products');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/products/[id]:', error);
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

    const result = await deleteProduct(id);

    if (!result.success) {
      const status = result.error === 'Product not found' || result.error === 'Invalid product ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the products page to reflect changes
    revalidatePath('/dashboard/products');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}