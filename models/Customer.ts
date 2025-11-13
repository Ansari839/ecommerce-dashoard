import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  status: 'Active' | 'Inactive' | 'VIP';
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema({
  customerId: {
    type: String,
    required: [true, 'Customer ID is required'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'Inactive', 'VIP'],
      message: 'Status must be either Active, Inactive, or VIP'
    },
    default: 'Active'
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: [0, 'Total orders cannot be negative']
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent cannot be negative']
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points cannot be negative']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a text index for search functionality
CustomerSchema.index({ 
  name: 'text', 
  email: 'text',
  customerId: 'text'
});

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);