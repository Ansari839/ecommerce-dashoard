import mongoose, { Document, Schema } from 'mongoose';
import Product from './Product'; // Assuming we have a Product model to reference

export interface IInventory extends Document {
  productId: string;
  stock: number;
  warehouseLocation: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Reference to Product model
    required: [true, 'Product ID is required'],
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  warehouseLocation: {
    type: String,
    required: [true, 'Warehouse location is required'],
    trim: true,
    maxlength: [100, 'Warehouse location cannot exceed 100 characters']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries by productId
InventorySchema.index({ productId: 1 });

// Virtual property to populate product details
InventorySchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema);