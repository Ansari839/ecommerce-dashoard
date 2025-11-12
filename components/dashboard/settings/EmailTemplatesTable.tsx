import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface EmailTemplate {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

interface EmailTemplatesTableProps {
  templates: EmailTemplate[];
  onEdit: (template: EmailTemplate) => void;
  onToggle: (id: number, enabled: boolean) => void;
}

export function EmailTemplatesTable({ templates, onEdit, onToggle }: EmailTemplatesTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Template Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {templates.map((template) => (
            <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{template.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{template.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.enabled}
                    onChange={(e) => onToggle(template.id, e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                    {template.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(template)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}