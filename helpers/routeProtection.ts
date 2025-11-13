import { NextRequest, NextResponse } from 'next/server';
import { checkPermissionMiddleware } from '@/middleware/checkPermission';

/**
 * Higher-order function to create a protected route handler
 * @param handler The original route handler function
 * @param module The module name for permission checking
 * @param action The action name for permission checking
 * @returns A new function that checks permissions before calling the original handler
 */
export function withPermissionCheck(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  module: string,
  action: string
) {
  return async (request: NextRequest, ...args: any[]) => {
    // Check permission
    const permissionCheck = await checkPermissionMiddleware(request, module, action);
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }
    
    // If authorized, proceed with the original handler
    return handler(request, ...args);
  };
}