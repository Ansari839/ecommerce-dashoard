import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId;
  stock: number;
  warehouseLocation?: string;
  lastUpdated: Date;
  unitCost?: number;
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
  },
  warehouseLocation: {
    type: String,
    required: false, // Optional field
    trim: true,
    maxlength: [100, 'Warehouse location cannot exceed 100 characters']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  unitCost: {
    type: Number,
    required: false, // Optional field
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries by productId
InventorySchema.index({ productId: 1 });

// Text index on warehouseLocation for search functionality
InventorySchema.index({ warehouseLocation: 'text' });

// Virtual property to populate product details
InventorySchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema);