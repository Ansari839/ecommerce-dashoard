import { NextRequest, NextResponse } from 'next/server';
import { 
  getRoles, 
  createRole 
} from '@/controllers/roleController';
import { revalidatePath } from 'next/cache';
import { checkPermissionMiddleware } from '@/middleware/checkPermission';

export async function GET(request: NextRequest) {
  try {
    // Check permission for viewing roles
    const permissionCheck = await checkPermissionMiddleware(request, 'roles', 'view');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    const result = await getRoles();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check permission for creating roles
    const permissionCheck = await checkPermissionMiddleware(request, 'roles', 'create');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'permissions'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || 
          (Array.isArray(body[field]) && body[field].length === 0) ||
          (!Array.isArray(body[field]) && body[field] === '')) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const result = await createRole({
      name: body.name,
      permissions: body.permissions
    });

    if (!result.success) {
      const status = result.error === 'Validation failed' ? 400 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the roles page to reflect changes
    revalidatePath('/dashboard/roles');

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}