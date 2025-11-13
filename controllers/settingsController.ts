import { connectDB } from '@/lib/db';
import Settings from '@/models/Settings';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';

// Get all settings
export async function getAllSettings() {
  try {
    await connectDB();

    const settings = await Settings.findOne();

    if (!settings) {
      // Return default settings if none exist
      return success({
        storeInfo: {
          name: 'My E-Commerce Store',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          phone: '(555) 123-4567',
          email: 'contact@myecommerce.com'
        },
        taxSettings: {
          taxSystem: 'no_tax',
          taxRate: 0,
          taxIncluded: false,
          regions: [
            { id: 1, name: 'New York', rate: 8.25, enabled: true },
            { id: 2, name: 'California', rate: 7.25, enabled: true },
            { id: 3, name: 'Texas', rate: 6.25, enabled: false },
            { id: 4, name: 'International', rate: 19.0, enabled: true }
          ]
        },
        shippingSettings: {
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
        },
        paymentSettings: {
          gateways: [
            { id: 1, name: 'Stripe', enabled: false, credentials: { apiKey: '', secretKey: '', sandboxMode: true } },
            { id: 2, name: 'PayPal', enabled: false, credentials: { apiKey: '', secretKey: '', merchantId: '', sandboxMode: true } },
            { id: 3, name: 'Wallet', enabled: false, credentials: { merchantId: '', sandboxMode: true } }
          ]
        },
        emailSettings: {
          templates: [
            { id: 1, name: 'Order Confirmation', description: 'Sent when an order is placed', enabled: true },
            { id: 2, name: 'Shipping Notification', description: 'Sent when an order is shipped', enabled: true },
            { id: 3, name: 'Refund Processed', description: 'Sent when a refund is processed', enabled: false },
            { id: 4, name: 'Password Reset', description: 'Sent when password reset is requested', enabled: true },
            { id: 5, name: 'Newsletter Signup', description: 'Sent when user signs up for newsletter', enabled: true }
          ]
        },
        rbacSettings: {
          roles: [
            { id: 1, name: 'Administrator', description: 'Full access to all features', permissions: ['Read Products', 'Create Products', 'Update Products', 'Delete Products', 'Read Orders', 'Update Orders', 'Read Customers', 'Update Customers', 'Read Reports', 'Read Settings', 'Update Settings'] },
            { id: 2, name: 'Manager', description: 'Access to products, orders, and customers', permissions: ['Read Products', 'Create Products', 'Update Products', 'Read Orders', 'Update Orders', 'Read Customers', 'Update Customers', 'Read Reports'] },
            { id: 3, name: 'Staff', description: 'Limited access to customer orders', permissions: ['Read Orders', 'Update Orders', 'Read Customers'] },
            { id: 4, name: 'Accountant', description: 'Access to reports and financial data', permissions: ['Read Orders', 'Read Reports', 'Read Customers'] }
          ]
        },
        localizationSettings: {
          currency: 'USD',
          language: 'en',
          timezone: 'EST',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h'
        }
      }, MESSAGES.SETTINGS_FETCHED);
    }

    return success(settings, MESSAGES.SETTINGS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching settings:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Update settings
export async function updateSettings(settingsData: any) {
  try {
    await connectDB();

    let settings = await Settings.findOne();

    if (!settings) {
      // Create new settings document
      settings = new Settings(settingsData);
    } else {
      // Update existing settings
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { ...settingsData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    }

    if (!settings) {
      return error(MESSAGES.SETTINGS_UPDATE_FAILED);
    }

    return success(settings, MESSAGES.SETTINGS_UPDATED);
  } catch (err: any) {
    console.error('Error updating settings:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get audit logs
export async function getAuditLogs() {
  try {
    await connectDB();

    // In a real implementation, this would fetch from a separate audit logs collection
    // For now, we return sample data
    const sampleLogs = [
      { id: 1, timestamp: '2023-06-15T10:30:00Z', user: 'admin@example.com', action: 'Updated product', module: 'Products', details: 'Updated product #P123' },
      { id: 2, timestamp: '2023-06-15T09:45:00Z', user: 'manager@example.com', action: 'Created order', module: 'Orders', details: 'Created order #O456' },
      { id: 3, timestamp: '2023-06-14T16:20:00Z', user: 'admin@example.com', action: 'Changed settings', module: 'Settings', details: 'Updated tax settings' },
      { id: 4, timestamp: '2023-06-14T14:10:00Z', user: 'staff@example.com', action: 'Updated order status', module: 'Orders', details: 'Updated order #O789 to Shipped' },
      { id: 5, timestamp: '2023-06-13T11:55:00Z', user: 'admin@example.com', action: 'Deleted product', module: 'Products', details: 'Deleted product #P101' },
    ];

    return success(sampleLogs, MESSAGES.AUDIT_LOGS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching audit logs:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}