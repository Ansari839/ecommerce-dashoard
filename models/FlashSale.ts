import mongoose, { Document, Schema } from 'mongoose';

export interface IFlashSale extends Document {
  title: string;
  description?: string;
  productId: string; // Reference to the product being on sale
  discountPercentage: number;
  salePrice: number;
  originalPrice: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'upcoming' | 'expired';
  maxQuantity: number;
  remainingQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const FlashSaleSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Flash sale title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
    trim: true
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100%']
  },
  salePrice: {
    type: Number,
    required: [true, 'Sale price is required'],
    min: [0, 'Sale price cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Original price cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'upcoming', 'expired'],
      message: 'Status must be either active, upcoming, or expired'
    },
    default: 'upcoming'
  },
  maxQuantity: {
    type: Number,
    required: [true, 'Max quantity is required'],
    min: [1, 'Max quantity must be at least 1']
  },
  remainingQuantity: {
    type: Number,
    required: [true, 'Remaining quantity is required'],
    min: [0, 'Remaining quantity cannot be negative']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create text index for search functionality
FlashSaleSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware to calculate status based on dates
FlashSaleSchema.pre('save', function() {
  const now = new Date();
  if (this.startDate > now) {
    this.status = 'upcoming';
  } else if (this.endDate < now) {
    this.status = 'expired';
  } else {
    this.status = 'active';
  }
});

export default mongoose.models.FlashSale || mongoose.model<IFlashSale>('FlashSale', FlashSaleSchema);