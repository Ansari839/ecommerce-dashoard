import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Role from '@/models/Role';
import { comparePassword } from '@/helpers/passwordUtils';
import { generateToken } from '@/helpers/jwtUtils';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';

/**
 * Register a new user
 */
export async function registerUser(userData: { name: string; email: string; password: string; roleId: string }) {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return error(MESSAGES.USER_EMAIL_EXISTS);
    }

    // Check if role exists
    const role = await Role.findById(userData.roleId);
    if (!role) {
      return error(MESSAGES.ROLE_NOT_FOUND);
    }

    // Create new user
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password, // Will be hashed by the pre-save middleware
      roleId: userData.roleId
    });

    const savedUser = await newUser.save();

    // Create JWT token for the new user
    const token = generateToken({ 
      id: savedUser._id, 
      email: savedUser.email 
    });

    return success({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        roleId: savedUser.roleId,
        status: savedUser.status
      }
    }, MESSAGES.USER_REGISTERED);
  } catch (err: any) {
    console.error('Error registering user:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Login a user
 */
export async function loginUser(credentials: { email: string; password: string }) {
  try {
    await connectDB();

    // Find user by email (but don't select the password initially)
    const user = await User.findOne({ email: credentials.email }).select('+password');
    
    if (!user) {
      return error(MESSAGES.INVALID_CREDENTIALS);
    }

    // Compare password
    const isPasswordValid = await comparePassword(credentials.password, user.password);
    
    if (!isPasswordValid) {
      return error(MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (user.status !== 'active') {
      return error(MESSAGES.USER_INACTIVE);
    }

    // Get full user details for the token
    const fullUser = await User.findById(user._id).populate('roleId', 'name permissions');

    // Create JWT token
    const token = generateToken({ 
      id: fullUser!._id, 
      email: fullUser!.email 
    });

    return success({
      token,
      user: {
        id: fullUser!._id,
        name: fullUser!.name,
        email: fullUser!.email,
        roleId: fullUser!.roleId,
        status: fullUser!.status
      }
    }, MESSAGES.USER_LOGGED_IN);
  } catch (err: any) {
    console.error('Error logging in user:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Get current user details
 */
export async function getCurrentUser(userId: string) {
  try {
    await connectDB();

    const user = await User.findById(userId).populate('roleId', 'name permissions');

    if (!user) {
      return error(MESSAGES.USER_NOT_FOUND);
    }

    return success({
      id: user._id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, MESSAGES.USER_FETCHED);
  } catch (err: any) {
    console.error('Error fetching user:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}