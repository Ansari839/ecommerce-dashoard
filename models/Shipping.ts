import mongoose, { Document, Schema } from 'mongoose';

export interface IShipping extends Document {
  shipmentId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  courier: 'FedEx' | 'DHL' | 'UPS';
  trackingNumber: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Returned';
  estimatedDelivery: Date;
  actualDelivery?: Date;
  shippingCost: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ShippingSchema: Schema = new Schema({
  shipmentId: {
    type: String,
    required: [true, 'Shipment ID is required'],
    unique: true,
    trim: true,
  },
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    trim: true,
  },
  customerId: {
    type: String,
    required: [true, 'Customer ID is required'],
    trim: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer Name is required'],
    trim: true,
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  courier: {
    type: String,
    enum: {
      values: ['FedEx', 'DHL', 'UPS'],
      message: 'Courier must be either FedEx, DHL, or UPS'
    },
    required: [true, 'Courier is required']
  },
  trackingNumber: {
    type: String,
    required: [true, 'Tracking number is required'],
    unique: true,
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Shipped', 'Delivered', 'Returned'],
      message: 'Shipping status must be either Pending, Shipped, Delivered, or Returned'
    },
    default: 'Pending'
  },
  estimatedDelivery: {
    type: Date,
    required: [true, 'Estimated delivery date is required'],
  },
  actualDelivery: {
    type: Date,
  },
  shippingCost: {
    type: Number,
    required: [true, 'Shipping cost is required'],
    min: [0, 'Shipping cost cannot be negative']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: { type: Number, min: [0, 'Length cannot be negative'] },
    width: { type: Number, min: [0, 'Width cannot be negative'] },
    height: { type: Number, min: [0, 'Height cannot be negative'] },
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a text index for search functionality
ShippingSchema.index({ 
  shipmentId: 'text', 
  orderId: 'text', 
  customerName: 'text',
  trackingNumber: 'text'
});

export default mongoose.models.Shipping || mongoose.model<IShipping>('Shipping', ShippingSchema);