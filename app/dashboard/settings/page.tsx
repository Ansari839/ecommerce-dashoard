'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StoreInfoForm } from '@/components/dashboard/settings/StoreInfoForm';
import { TaxSettingsForm } from '@/components/dashboard/settings/TaxSettingsForm';
import { EmailTemplatesTable } from '@/components/dashboard/settings/EmailTemplatesTable';
import { LocalizationForm } from '@/components/dashboard/settings/LocalizationForm';
import { RBACForm } from '@/components/dashboard/settings/RBACForm';
import { ShippingRulesForm } from '@/components/dashboard/settings/ShippingRulesForm';
import { PaymentGatewaysForm } from '@/components/dashboard/settings/PaymentGatewaysForm';
import { AuditLogsTable } from '@/components/dashboard/settings/AuditLogsTable';

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
    taxSystem: 'no_tax',
    taxRate: 0,
    taxIncluded: false,
    regions: [
      { id: 1, name: 'New York', rate: 8.25, enabled: true },
      { id: 2, name: 'California', rate: 7.25, enabled: true },
      { id: 3, name: 'Texas', rate: 6.25, enabled: false },
      { id: 4, name: 'International', rate: 19.0, enabled: true }
    ]
  });

  // Shipping Rules state
  const [shippingRules, setShippingRules] = useState({
    freeShippingThreshold: 50,
    couriers: [
      { id: 1, name: 'FedEx', enabled: true },
      { id: 2, name: 'DHL', enabled: true },
      { id: 3, name: 'UPS', enabled: true }
    ],
    zones: [
      { id: 1, name: 'Domestic', country: 'US', minOrderAmount: 0, cost: 5.99, deliveryTime: '3-5 days', enabled: true },
      { id: 2, name: 'International', country: 'International', minOrderAmount: 0, cost: 12.99, deliveryTime: '7-14 days', enabled: true }
    ]
  });

  // Payment Gateways state
  const [paymentGateways, setPaymentGateways] = useState([
    { id: 1, name: 'Stripe', enabled: false, credentials: { apiKey: '', secretKey: '', sandboxMode: true } },
    { id: 2, name: 'PayPal', enabled: false, credentials: { apiKey: '', secretKey: '', merchantId: '', sandboxMode: true } },
    { id: 3, name: 'Wallet', enabled: false, credentials: { merchantId: '', sandboxMode: true } }
  ]);

  // Email Templates state
  const [emailTemplates, setEmailTemplates] = useState([
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

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, timestamp: '2023-06-15T10:30:00Z', user: 'admin@example.com', action: 'Updated product', module: 'Products', details: 'Updated product #P123' },
    { id: 2, timestamp: '2023-06-15T09:45:00Z', user: 'manager@example.com', action: 'Created order', module: 'Orders', details: 'Created order #O456' },
    { id: 3, timestamp: '2023-06-14T16:20:00Z', user: 'admin@example.com', action: 'Changed settings', module: 'Settings', details: 'Updated tax settings' },
    { id: 4, timestamp: '2023-06-14T14:10:00Z', user: 'staff@example.com', action: 'Updated order status', module: 'Orders', details: 'Updated order #O789 to Shipped' },
    { id: 5, timestamp: '2023-06-13T11:55:00Z', user: 'admin@example.com', action: 'Deleted product', module: 'Products', details: 'Deleted product #P101' },
  ]);

  // Active section state
  const [activeSection, setActiveSection] = useState('store');

  // Load settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        
        if (data.success) {
          setStoreInfo(data.data.storeInfo || storeInfo);
          setTaxSettings(data.data.taxSettings || taxSettings);
          setShippingRules(data.data.shippingSettings || shippingRules);
          setPaymentGateways(data.data.paymentSettings?.gateways || paymentGateways);
          setEmailTemplates(data.data.emailSettings?.templates || emailTemplates);
          setLocalization(data.data.localizationSettings || localization);
          setRoles(data.data.rbacSettings?.roles || roles);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Load audit logs from API
  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (activeSection === 'audit') {
        try {
          const response = await fetch('/api/settings?section=audit-logs');
          if (!response.ok) {
            throw new Error('Failed to fetch audit logs');
          }
          const data = await response.json();
          
          if (data.success) {
            setAuditLogs(data.data || []);
          }
        } catch (error) {
          console.error('Error fetching audit logs:', error);
        }
      }
    };

    fetchAuditLogs();
  }, [activeSection]);

  // Handle email template toggle
  const handleTemplateToggle = (id: number, enabled: boolean) => {
    setEmailTemplates(prevTemplates =>
      prevTemplates.map(template =>
        template.id === id ? { ...template, enabled } : template
      )
    );
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
  const handleSave = async () => {
    try {
      const settingsToSave = {
        storeInfo,
        taxSettings,
        shippingSettings: shippingRules,
        paymentSettings: { gateways: paymentGateways },
        emailSettings: { templates: emailTemplates },
        rbacSettings: { roles },
        localizationSettings: localization
      };

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  // Cancel handler
  const handleCancel = () => {
    // In a real implementation, this would reset to the previous values
    console.log('Cancelled changes');
  };

  // Section titles
  const sections = [
    { id: 'store', title: 'Store Settings' },
    { id: 'tax', title: 'Tax Settings' },
    { id: 'shipping', title: 'Shipping Rules' },
    { id: 'payment', title: 'Payment Gateways' },
    { id: 'email', title: 'Email Templates' },
    { id: 'rbac', title: 'Roles & Permissions' },
    { id: 'audit', title: 'Audit Logs' }
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings & Configuration</h1>
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

            {/* Shipping Rules Section */}
            {activeSection === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Shipping Rules</h2>
                  <ShippingRulesForm 
                    shippingRules={shippingRules} 
                    onChange={setShippingRules} 
                  />
                </div>
              </div>
            )}

            {/* Payment Gateways Section */}
            {activeSection === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Gateways</h2>
                  <PaymentGatewaysForm 
                    paymentGateways={paymentGateways} 
                    onChange={setPaymentGateways} 
                  />
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

            {/* Roles & Permissions Section */}
            {activeSection === 'rbac' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Role-based Access Control</h2>
                  <RBACForm roles={roles} onRoleChange={handlePermissionChange} />
                </div>
              </div>
            )}

            {/* Audit Logs Section */}
            {activeSection === 'audit' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
                  <AuditLogsTable logs={auditLogs} />
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