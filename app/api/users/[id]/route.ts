import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserById,
  updateUser,
  deleteUser,
  assignRoleToUser
} from '@/controllers/userController';
import { revalidatePath } from 'next/cache';
import { checkPermissionMiddleware } from '@/middleware/checkPermission';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check permission for viewing users
    const permissionCheck = await checkPermissionMiddleware(request, 'users', 'view');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;

    const result = await getUserById(id);

    if (!result.success) {
      const status = result.error === 'User not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/users/[id]:', error);
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
    // Check permission for updating users
    const permissionCheck = await checkPermissionMiddleware(request, 'users', 'update');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;
    const body = await request.json();

    const result = await updateUser(id, body);

    if (!result.success) {
      const status =
        result.error === 'User not found' || result.error === 'Invalid user ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the users page to reflect changes
    revalidatePath('/dashboard/users');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/users/[id]:', error);
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
    // Check permission for deleting users
    const permissionCheck = await checkPermissionMiddleware(request, 'users', 'delete');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;

    const result = await deleteUser(id);

    if (!result.success) {
      const status = result.error === 'User not found' || result.error === 'Invalid user ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the users page to reflect changes
    revalidatePath('/dashboard/users');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}