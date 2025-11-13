import mongoose, { Document, Schema } from 'mongoose';

export interface IProfitLoss extends Document {
  period: string; // Monthly, quarterly, annual
  totalRevenue: number;
  totalCost: number;
  totalExpenses: number;
  netProfit: number;
  grossProfit: number;
  revenueByCategory?: { [category: string]: number };
  costByCategory?: { [category: string]: number };
  expensesByCategory?: { [category: string]: number };
  createdAt: Date;
  updatedAt: Date;
}

const ProfitLossSchema: Schema = new Schema({
  period: {
    type: String,
    required: [true, 'Period is required'],
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'],
    trim: true
  },
  totalRevenue: {
    type: Number,
    required: [true, 'Total revenue is required'],
    min: [0, 'Total revenue cannot be negative']
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
    min: [0, 'Total cost cannot be negative']
  },
  totalExpenses: {
    type: Number,
    required: [true, 'Total expenses is required'],
    min: [0, 'Total expenses cannot be negative']
  },
  netProfit: {
    type: Number,
    required: [true, 'Net profit is required']
  },
  grossProfit: {
    type: Number,
    required: [true, 'Gross profit is required']
  },
  revenueByCategory: {
    type: Map,
    of: Number,
    default: {}
  },
  costByCategory: {
    type: Map,
    of: Number,
    default: {}
  },
  expensesByCategory: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries by period
ProfitLossSchema.index({ period: 1 });
// Index for faster queries by date range
ProfitLossSchema.index({ createdAt: 1 });

export default mongoose.models.ProfitLoss || mongoose.model<IProfitLoss>('ProfitLoss', ProfitLossSchema);