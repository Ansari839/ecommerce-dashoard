import { connectDB } from '@/lib/db';
import Role from '@/models/Role';
import User from '@/models/User';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

/**
 * Create a new role
 */
export async function createRole(roleData: { name: string; permissions: any[] }) {
  try {
    await connectDB();

    // Check if role already exists
    const existingRole = await Role.findOne({ name: roleData.name });
    if (existingRole) {
      return error(MESSAGES.ROLE_NAME_EXISTS);
    }

    const newRole = new Role({
      name: roleData.name,
      permissions: roleData.permissions
    });

    const savedRole = await newRole.save();

    return success(savedRole, MESSAGES.ROLE_CREATED);
  } catch (err: any) {
    console.error('Error creating role:', err);

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
 * Get all roles
 */
export async function getRoles() {
  try {
    await connectDB();

    const roles = await Role.find({});

    return success(roles, MESSAGES.ROLES_FETCHED);
  } catch (err: any) {
    console.error('Error fetching roles:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Get a specific role by ID
 */
export async function getRoleById(id: string) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const role = await Role.findById(id);

    if (!role) {
      return error(MESSAGES.ROLE_NOT_FOUND);
    }

    return success(role, MESSAGES.ROLE_FETCHED);
  } catch (err: any) {
    console.error('Error fetching role:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Update an existing role
 */
export async function updateRole(id: string, roleData: { name: string; permissions: any[] }) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Check if role exists
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return error(MESSAGES.ROLE_NOT_FOUND);
    }

    // Check if another role with the same name exists (excluding current role)
    if (roleData.name && roleData.name !== existingRole.name) {
      const duplicateName = await Role.findOne({ 
        name: roleData.name, 
        _id: { $ne: id } 
      });
      if (duplicateName) {
        return error(MESSAGES.ROLE_NAME_EXISTS);
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { 
        name: roleData.name || existingRole.name,
        permissions: roleData.permissions || existingRole.permissions
      },
      { new: true, runValidators: true } // Return updated document and run validations
    );

    return success(updatedRole, MESSAGES.ROLE_UPDATED);
  } catch (err: any) {
    console.error('Error updating role:', err);

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
 * Delete a role
 */
export async function deleteRole(id: string) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Check if role exists
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return error(MESSAGES.ROLE_NOT_FOUND);
    }

    // Check if any users are assigned to this role
    const usersWithRole = await User.find({ roleId: id });
    if (usersWithRole.length > 0) {
      return error(MESSAGES.ROLE_HAS_USERS);
    }

    await Role.findByIdAndDelete(id);

    return success(null, MESSAGES.ROLE_DELETED);
  } catch (err: any) {
    console.error('Error deleting role:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}