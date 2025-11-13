import { NextRequest } from 'next/server';

export interface User {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

export function authorize(request: NextRequest, allowedRoles: string[]): { authorized: boolean; user?: User; error?: string } {
  // In a real application, you would extract and verify the token from headers
  // For this example, we'll simulate the user from session or token
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1]; // Bearer <token>

    // For demo purposes, simulate user data
    // In a real app, you would verify the JWT token and extract user info
    if (!token) {
      return {
        authorized: false,
        error: 'Access token is required'
      };
    }

    // Simulated user data (in a real app, decode and verify the JWT)
    // For this example we'll hardcode a user with role
    // In real implementation you would decode the JWT to get user details
    const simulatedUser: User = {
      id: 'user123',
      email: 'admin@example.com',
      role: 'Admin' // You can change this to test different roles
    };

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(simulatedUser.role)) {
      return {
        authorized: false,
        error: 'Access denied. Insufficient permissions.'
      };
    }

    return {
      authorized: true,
      user: simulatedUser
    };
  } catch (error) {
    console.error('Authorization error:', error);
    return {
      authorized: false,
      error: 'Authorization failed'
    };
  }
}