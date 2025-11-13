import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: 'Card' | 'COD' | 'Wallet';
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  transactionId?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  paymentId: {
    type: String,
    required: [true, 'Payment ID is required'],
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
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  method: {
    type: String,
    enum: {
      values: ['Card', 'COD', 'Wallet'],
      message: 'Payment method must be either Card, COD, or Wallet'
    },
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: {
      values: ['Paid', 'Pending', 'Failed', 'Refunded'],
      message: 'Payment status must be either Paid, Pending, Failed, or Refunded'
    },
    default: 'Pending'
  },
  transactionId: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a text index for search functionality
PaymentSchema.index({ 
  paymentId: 'text', 
  orderId: 'text',
  customerName: 'text',
  transactionId: 'text'
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);