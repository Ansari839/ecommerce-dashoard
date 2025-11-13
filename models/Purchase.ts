import mongoose, { Document, Schema } from 'mongoose';
import Product from './Product'; // Reference to Product model

export interface IPurchase extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  supplier: string;
  purchaseDate: Date;
  price: number;
  totalPrice?: number;
  warehouseLocation?: string;
  createdBy: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Reference to Product model
    required: [true, 'Product ID is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    trim: true,
    maxlength: [100, 'Supplier name cannot exceed 100 characters']
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  totalPrice: {
    type: Number,
    required: false, // Optional field
    min: [0, 'Total price cannot be negative'],
    // Will be calculated on save if not provided
  },
  warehouseLocation: {
    type: String,
    required: false, // Optional field
    trim: true,
    maxlength: [100, 'Warehouse location cannot exceed 100 characters']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming a User model exists for tracking who created the purchase
    required: [true, 'Created by is required'],
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Calculate total price before saving if not provided
PurchaseSchema.pre('save', function(next) {
  if (!this.totalPrice && this.quantity && this.price) {
    this.totalPrice = this.quantity * this.price;
  }
  next();
});

// Index for faster queries by purchaseDate
PurchaseSchema.index({ purchaseDate: 1 });

// Index for faster queries by supplier
PurchaseSchema.index({ supplier: 1 });

// Virtual property to populate product details
PurchaseSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);