import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minimumOrderAmount?: number;
  startDate: Date;
  endDate: Date;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  usageLimitPerUser?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Coupon code must be at least 3 characters long'],
    maxlength: [20, 'Coupon code cannot exceed 20 characters']
  },
  discountType: {
    type: String,
    enum: {
      values: ['percentage', 'fixed_amount'],
      message: 'Discount type must be either percentage or fixed_amount'
    },
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  maxUses: {
    type: Number,
    default: 0, // 0 means unlimited
    min: [0, 'Max uses cannot be negative']
  },
  currentUses: {
    type: Number,
    default: 0,
    min: [0, 'Current uses cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimitPerUser: {
    type: Number,
    default: 1, // 0 means unlimited per user
    min: [0, 'Usage limit per user cannot be negative']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create text index for search functionality
CouponSchema.index({ code: 'text' });

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);