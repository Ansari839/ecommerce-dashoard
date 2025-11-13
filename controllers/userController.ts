import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Role from '@/models/Role';
import { comparePassword, hashPassword } from '@/helpers/passwordUtils';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

/**
 * Get all users
 */
export async function getUsers() {
  try {
    await connectDB();

    const users = await User.find({}).populate('roleId', 'name');

    return success(users, MESSAGES.USERS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching users:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Get a specific user by ID
 */
export async function getUserById(id: string) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const user = await User.findById(id).populate('roleId', 'name permissions');

    if (!user) {
      return error(MESSAGES.USER_NOT_FOUND);
    }

    return success(user, MESSAGES.USER_FETCHED);
  } catch (err: any) {
    console.error('Error fetching user:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Create a new user from dashboard
 */
export async function createUser(userData: { name: string; email: string; password: string; roleId: string; status?: string }) {
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

    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password, // Will be hashed by the pre-save middleware
      roleId: userData.roleId,
      status: userData.status || 'active'
    });

    const savedUser = await newUser.save();

    return success(savedUser, MESSAGES.USER_CREATED);
  } catch (err: any) {
    console.error('Error creating user:', err);

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
 * Update an existing user
 */
export async function updateUser(id: string, userData: Partial<{ name: string; email: string; password: string; roleId: string; status: string }>) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Get the existing user
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return error(MESSAGES.USER_NOT_FOUND);
    }

    // If email is being updated, check if it's already taken by another user
    if (userData.email && userData.email !== existingUser.email) {
      const duplicateEmail = await User.findOne({ 
        email: userData.email, 
        _id: { $ne: id } 
      });
      if (duplicateEmail) {
        return error(MESSAGES.USER_EMAIL_EXISTS);
      }
    }

    // If role is being updated, check if the role exists
    if (userData.roleId) {
      const role = await Role.findById(userData.roleId);
      if (!role) {
        return error(MESSAGES.ROLE_NOT_FOUND);
      }
    }

    // If password is being updated, hash it
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      userData,
      { new: true, runValidators: true } // Return updated document and run validations
    ).populate('roleId', 'name');

    return success(updatedUser, MESSAGES.USER_UPDATED);
  } catch (err: any) {
    console.error('Error updating user:', err);

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
 * Delete a user
 */
export async function deleteUser(id: string) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return error(MESSAGES.USER_NOT_FOUND);
    }

    return success(null, MESSAGES.USER_DELETED);
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Assign a role to a user
 */
export async function assignRoleToUser(userId: string, roleId: string) {
  try {
    await connectDB();

    // Validate ObjectIds format
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roleId)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return error(MESSAGES.USER_NOT_FOUND);
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return error(MESSAGES.ROLE_NOT_FOUND);
    }

    // Update user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { roleId: roleId },
      { new: true, runValidators: true } // Return updated document and run validations
    ).populate('roleId', 'name');

    return success(updatedUser, MESSAGES.ROLE_ASSIGNED);
  } catch (err: any) {
    console.error('Error assigning role to user:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}