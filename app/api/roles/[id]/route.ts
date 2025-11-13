import { NextRequest, NextResponse } from 'next/server';
import { 
  updateRole,
  deleteRole
} from '@/controllers/roleController';
import { revalidatePath } from 'next/cache';
import { checkPermissionMiddleware } from '@/middleware/checkPermission';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check permission for updating roles
    const permissionCheck = await checkPermissionMiddleware(request, 'roles', 'update');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;
    const body = await request.json();

    const result = await updateRole(id, body);

    if (!result.success) {
      const status =
        result.error === 'Role not found' || result.error === 'Invalid role ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the roles page to reflect changes
    revalidatePath('/dashboard/roles');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/roles/[id]:', error);
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
    // Check permission for deleting roles
    const permissionCheck = await checkPermissionMiddleware(request, 'roles', 'delete');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;

    const result = await deleteRole(id);

    if (!result.success) {
      const status = result.error === 'Role not found' || result.error === 'Invalid role ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the roles page to reflect changes
    revalidatePath('/dashboard/roles');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/roles/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}