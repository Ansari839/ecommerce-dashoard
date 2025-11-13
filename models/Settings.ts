import mongoose, { Document, Schema } from 'mongoose';

// Shipping Rule Schema
const ShippingRuleSchema: Schema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  minOrderAmount: { type: Number, required: true, default: 0 },
  cost: { type: Number, required: true, default: 0 },
  deliveryTime: { type: String, required: true },
  enabled: { type: Boolean, default: true }
});

// Courier Schema
const CourierSchema: Schema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  enabled: { type: Boolean, default: true }
});

// Shipping Settings Schema
const ShippingSettingsSchema: Schema = new Schema({
  freeShippingThreshold: { type: Number, default: 0 },
  couriers: [CourierSchema],
  zones: [ShippingRuleSchema],
}, {
  _id: false // Prevents creating _id for nested documents
});

// Payment Gateway Credentials Schema
const PaymentCredentialsSchema: Schema = new Schema({
  apiKey: String,
  secretKey: String,
  merchantId: String,
  sandboxMode: { type: Boolean, default: false }
}, {
  _id: false
});

// Payment Gateway Schema
const PaymentGatewaySchema: Schema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  enabled: { type: Boolean, default: false },
  credentials: PaymentCredentialsSchema
});

// Payment Settings Schema
const PaymentSettingsSchema: Schema = new Schema({
  gateways: [PaymentGatewaySchema],
}, {
  _id: false
});

// Email Template Schema
const EmailTemplateSchema: Schema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: String,
  enabled: { type: Boolean, default: true }
}, {
  _id: false
});

// Email Settings Schema
const EmailSettingsSchema: Schema = new Schema({
  templates: [EmailTemplateSchema],
}, {
  _id: false
});

// Role Permission Schema
const RolePermissionSchema: Schema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: String,
  permissions: [String]
}, {
  _id: false
});

// RBAC Settings Schema
const RBACSettingsSchema: Schema = new Schema({
  roles: [RolePermissionSchema],
}, {
  _id: false
});

// Audit Log Schema
const AuditLogSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now },
  user: { type: String, required: true },
  action: { type: String, required: true },
  module: { type: String, required: true },
  details: String
});

// Store Info Schema
const StoreInfoSchema: Schema = new Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  phone: String,
  email: String
}, {
  _id: false
});

// Tax Region Schema
const TaxRegionSchema: Schema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  enabled: { type: Boolean, default: true }
}, {
  _id: false
});

// Tax Settings Schema
const TaxSettingsSchema: Schema = new Schema({
  taxSystem: { type: String, enum: ['no_tax', 'vat', 'gst', 'sales_tax'], default: 'no_tax' },
  taxRate: { type: Number, default: 0 },
  taxIncluded: { type: Boolean, default: false },
  regions: [TaxRegionSchema]
}, {
  _id: false
});

// Localization Settings Schema
const LocalizationSettingsSchema: Schema = new Schema({
  currency: { type: String, default: 'USD' },
  language: { type: String, default: 'en' },
  timezone: { type: String, default: 'EST' },
  dateFormat: { type: String, default: 'MM/DD/YYYY' },
  timeFormat: { type: String, default: '12h' }
}, {
  _id: false
});

// Main Settings Schema
const SettingsSchema: Schema = new Schema({
  storeInfo: StoreInfoSchema,
  taxSettings: TaxSettingsSchema,
  shippingSettings: ShippingSettingsSchema,
  paymentSettings: PaymentSettingsSchema,
  emailSettings: EmailSettingsSchema,
  rbacSettings: RBACSettingsSchema,
  localizationSettings: LocalizationSettingsSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);