import Role from '@/models/Role';
import { IPermission } from '@/models/Role';

/**
 * Check if a user's role has permission for a specific module and action
 * @param roleId - The ID of the user's role
 * @param module - The module name (e.g., 'sales', 'products', 'users')
 * @param action - The action name (e.g., 'view', 'create', 'update', 'delete')
 * @returns Boolean indicating if the user has permission
 */
export async function checkPermission(roleId: string, module: string, action: string): Promise<boolean> {
  try {
    const role = await Role.findById(roleId);
    
    if (!role) {
      return false;
    }
    
    // Check if the role has permissions for the specified module
    const modulePermissions = role.permissions.find(
      (perm: IPermission) => perm.module === module
    );
    
    if (!modulePermissions) {
      return false; // Role doesn't have any permissions for this module
    }
    
    // Check if the role has the specific action permission
    return modulePermissions.actions.includes(action);
  } catch (error: any) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Check if a user's role has any permission for a specific module
 * @param roleId - The ID of the user's role
 * @param module - The module name (e.g., 'sales', 'products', 'users')
 * @returns Boolean indicating if the user has any permission for the module
 */
export async function hasModuleAccess(roleId: string, module: string): Promise<boolean> {
  try {
    const role = await Role.findById(roleId);
    
    if (!role) {
      return false;
    }
    
    // Check if the role has permissions for the specified module
    return role.permissions.some(
      (perm: IPermission) => perm.module === module
    );
  } catch (error: any) {
    console.error('Error checking module access:', error);
    return false;
  }
}

/**
 * Get all permissions for a role
 * @param roleId - The ID of the user's role
 * @returns Array of permissions
 */
export async function getRolePermissions(roleId: string): Promise<IPermission[]> {
  try {
    const role = await Role.findById(roleId);
    
    if (!role) {
      return [];
    }
    
    return role.permissions;
  } catch (error: any) {
    console.error('Error getting role permissions:', error);
    return [];
  }
}