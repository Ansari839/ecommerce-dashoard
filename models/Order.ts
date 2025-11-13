import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderId: string;
  customerId: string;
  customerName: string;
  products: IOrderProduct[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  date: Date;
}

const OrderProductSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema({
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    unique: true,
    trim: true,
  },
  customerId: {
    type: String,
    required: [true, 'Customer ID is required'],
    trim: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  products: [OrderProductSchema],
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total cannot be negative'],
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Returned'],
      message: 'Status must be either Pending, Processing, Shipped, Delivered, or Returned'
    },
    default: 'Pending'
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a text index for search functionality
OrderSchema.index({ 
  orderId: 'text', 
  customerName: 'text',
  'products.name': 'text' 
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);