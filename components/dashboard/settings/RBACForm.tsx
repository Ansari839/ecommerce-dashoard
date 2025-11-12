import { Label } from '@/components/ui/label';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

interface RBACFormProps {
  roles: Role[];
  onRoleChange: (roleId: number, permission: string, checked: boolean) => void;
}

export function RBACForm({ roles, onRoleChange }: RBACFormProps) {
  const allPermissions = [
    'Read Products',
    'Create Products',
    'Update Products',
    'Delete Products',
    'Read Orders',
    'Update Orders',
    'Read Customers',
    'Update Customers',
    'Read Reports',
    'Read Settings',
    'Update Settings',
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
            {allPermissions.map((permission) => (
              <th key={permission} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {permission}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                <Label>{role.name}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">{role.description}</p>
              </td>
              {allPermissions.map((permission) => (
                <td key={`${role.id}-${permission}`} className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={role.permissions.includes(permission)}
                      onChange={(e) => onRoleChange(role.id, permission, e.target.checked)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}