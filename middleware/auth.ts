import { NextRequest } from 'next/server';
import { verifyToken } from '@/helpers/jwtUtils';
import User from '@/models/User';
import { MESSAGES } from '@/constants/messages';

/**
 * Authenticates a request by validating the JWT token
 */
export async function authenticateRequest(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: MESSAGES.ACCESS_TOKEN_REQUIRED
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token
    const decodedToken = verifyToken(token);

    // Fetch user from database
    const user = await User.findById(decodedToken.id).populate('roleId');
    
    if (!user) {
      return {
        authenticated: false,
        error: MESSAGES.USER_NOT_FOUND
      };
    }

    // Check if user is active
    if (user.status !== 'active') {
      return {
        authenticated: false,
        error: MESSAGES.USER_INACTIVE
      };
    }

    return {
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        status: user.status
      }
    };
  } catch (error: any) {
    console.error('Authentication error:', error);
    return {
      authenticated: false,
      error: MESSAGES.INVALID_TOKEN
    };
  }
}

/**
 * Checks if a user has permission to perform an action on a module
 */
export async function checkPermission(user: any, module: string, action: string, allowedRoles: string[]) {
  // Admin role has access to everything
  if (user.roleId.name && user.roleId.name.toLowerCase() === 'admin') {
    return true;
  }

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(user.roleId.name)) {
    return false;
  }

  // Check if role has specific permissions for this module and action
  if (user.roleId.permissions) {
    const modulePermissions = user.roleId.permissions.find(
      (perm: { module: string; actions: string[] }) => perm.module === module
    );

    if (modulePermissions && modulePermissions.actions.includes(action)) {
      return true;
    }
  }

  return false;
}