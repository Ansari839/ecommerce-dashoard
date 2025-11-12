'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StoreInfoForm } from '@/components/dashboard/settings/StoreInfoForm';
import { TaxSettingsForm } from '@/components/dashboard/settings/TaxSettingsForm';
import { EmailTemplatesTable } from '@/components/dashboard/settings/EmailTemplatesTable';
import { LocalizationForm } from '@/components/dashboard/settings/LocalizationForm';
import { RBACForm } from '@/components/dashboard/settings/RBACForm';

export default function SettingsPage() {
  // Store Info state
  const [storeInfo, setStoreInfo] = useState({
    name: 'My E-Commerce Store',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '(555) 123-4567',
    email: 'contact@myecommerce.com'
  });
  
  // Tax Settings state
  const [taxSettings, setTaxSettings] = useState({
    taxSystem: 'vat',
    taxRate: 8.5,
    taxIncluded: false,
    regions: [
      { id: 1, name: 'New York', rate: 8.25, enabled: true },
      { id: 2, name: 'California', rate: 7.25, enabled: true },
      { id: 3, name: 'Texas', rate: 6.25, enabled: false },
      { id: 4, name: 'International', rate: 19.0, enabled: true }
    ]
  });
  
  // Email Templates state
  const [emailTemplates] = useState([
    { id: 1, name: 'Order Confirmation', description: 'Sent when an order is placed', enabled: true },
    { id: 2, name: 'Shipping Notification', description: 'Sent when an order is shipped', enabled: true },
    { id: 3, name: 'Refund Processed', description: 'Sent when a refund is processed', enabled: false },
    { id: 4, name: 'Password Reset', description: 'Sent when password reset is requested', enabled: true },
    { id: 5, name: 'Newsletter Signup', description: 'Sent when user signs up for newsletter', enabled: true }
  ]);
  
  // Localization state
  const [localization, setLocalization] = useState({
    currency: 'USD',
    language: 'en',
    timezone: 'EST',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });
  
  // RBAC state
  const [roles, setRoles] = useState([
    { id: 1, name: 'Administrator', description: 'Full access to all features', permissions: ['Read Products', 'Create Products', 'Update Products', 'Delete Products', 'Read Orders', 'Update Orders', 'Read Customers', 'Update Customers', 'Read Reports', 'Read Settings', 'Update Settings'] },
    { id: 2, name: 'Manager', description: 'Access to products, orders, and customers', permissions: ['Read Products', 'Create Products', 'Update Products', 'Read Orders', 'Update Orders', 'Read Customers', 'Update Customers', 'Read Reports'] },
    { id: 3, name: 'Staff', description: 'Limited access to customer orders', permissions: ['Read Orders', 'Update Orders', 'Read Customers'] },
    { id: 4, name: 'Accountant', description: 'Access to reports and financial data', permissions: ['Read Orders', 'Read Reports', 'Read Customers'] }
  ]);
  
  // Active section state
  const [activeSection, setActiveSection] = useState('store');
  
  // Handle email template toggle
  const handleTemplateToggle = (id: number, enabled: boolean) => {
    console.log(`Template ${id} ${enabled ? 'enabled' : 'disabled'}`);
  };
  
  // Handle email template edit
  const handleTemplateEdit = (template: any) => {
    console.log('Edit template:', template);
  };
  
  // Handle RBAC permission change
  const handlePermissionChange = (roleId: number, permission: string, checked: boolean) => {
    setRoles(prevRoles => 
      prevRoles.map(role => {
        if (role.id === roleId) {
          let updatedPermissions = [...role.permissions];
          if (checked) {
            if (!updatedPermissions.includes(permission)) {
              updatedPermissions.push(permission);
            }
          } else {
            updatedPermissions = updatedPermissions.filter(p => p !== permission);
          }
          return { ...role, permissions: updatedPermissions };
        }
        return role;
      })
    );
  };
  
  // Save settings handler
  const handleSave = () => {
    console.log('Saving settings...');
    // In a real implementation, this would save to the backend
    alert('Settings saved successfully!');
  };
  
  // Cancel handler
  const handleCancel = () => {
    // In a real implementation, this would reset to the previous values
    console.log('Cancelled changes');
  };
  
  // Section titles
  const sections = [
    { id: 'store', title: 'Store Info' },
    { id: 'tax', title: 'Tax Settings' },
    { id: 'email', title: 'Email Templates' },
    { id: 'localization', title: 'Currency & Localization' },
    { id: 'rbac', title: 'Role-based Access Control' }
  ];
  
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your store configuration and settings</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            {/* Store Info Section */}
            {activeSection === 'store' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Store Information</h2>
                  <StoreInfoForm storeInfo={storeInfo} onChange={setStoreInfo} />
                </div>
              </div>
            )}
            
            {/* Tax Settings Section */}
            {activeSection === 'tax' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Tax Settings</h2>
                  <TaxSettingsForm taxSettings={taxSettings} onChange={setTaxSettings} />
                </div>
              </div>
            )}
            
            {/* Email Templates Section */}
            {activeSection === 'email' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Email Templates</h2>
                  <EmailTemplatesTable 
                    templates={emailTemplates} 
                    onEdit={handleTemplateEdit}
                    onToggle={handleTemplateToggle} 
                  />
                </div>
              </div>
            )}
            
            {/* Localization Section */}
            {activeSection === 'localization' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Currency & Localization</h2>
                  <LocalizationForm localization={localization} onChange={setLocalization} />
                </div>
              </div>
            )}
            
            {/* RBAC Section */}
            {activeSection === 'rbac' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Role-based Access Control</h2>
                  <RBACForm roles={roles} onRoleChange={handlePermissionChange} />
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}