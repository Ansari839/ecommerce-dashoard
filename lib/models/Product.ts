import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Draft' | 'Out of Stock';
  image?: string;
  description?: string;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'Draft', 'Out of Stock'],
      message: 'Status must be either Active, Draft, or Out of Stock'
    },
    default: 'Draft'
  },
  image: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a text index for search functionality
ProductSchema.index({ name: 'text', category: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);