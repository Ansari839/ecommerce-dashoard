import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { checkPermission } from '@/helpers/permissionUtils';

export async function checkPermissionMiddleware(
  request: NextRequest,
  module: string,
  action: string
): Promise<{ authorized: boolean; user?: any; error?: string }> {
  // First authenticate the user
  const authResult = await authenticateRequest(request);
  
  if (!authResult || authResult.error) {
    return {
      authorized: false,
      error: authResult?.error || 'Authentication failed'
    };
  }

  const user = authResult.user;

  // Check if user is active
  if (user.status !== 'active') {
    return {
      authorized: false,
      error: 'User account is inactive'
    };
  }

  // Admin role has access to everything
  if (user.roleId.name?.toLowerCase() === 'admin') {
    return {
      authorized: true,
      user
    };
  }

  // Check specific permission
  const hasPermission = await checkPermission(user.roleId._id.toString(), module, action);
  
  if (!hasPermission) {
    return {
      authorized: false,
      error: `Access denied: You don't have permission to ${action} ${module}`
    };
  }

  return {
    authorized: true,
    user
  };
}