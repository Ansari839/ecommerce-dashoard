import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketingExpense extends Document {
  campaignName: string;
  platform: string;
  startDate: Date;
  endDate: Date;
  adSpend: number;
  clicks: number;
  conversions: number;
  revenueGenerated: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MarketingExpenseSchema: Schema = new Schema({
  campaignName: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [100, 'Campaign name cannot exceed 100 characters']
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: ['Facebook', 'Google', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Email', 'Other'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  adSpend: {
    type: Number,
    required: [true, 'Ad spend is required'],
    min: [0, 'Ad spend cannot be negative']
  },
  clicks: {
    type: Number,
    required: [true, 'Clicks is required'],
    min: [0, 'Clicks cannot be negative']
  },
  conversions: {
    type: Number,
    required: [true, 'Conversions is required'],
    min: [0, 'Conversions cannot be negative']
  },
  revenueGenerated: {
    type: Number,
    required: [true, 'Revenue generated is required'],
    min: [0, 'Revenue generated cannot be negative']
  },
  createdBy: {
    type: String, // Changed to string since User model doesn't exist yet
    // In a real application with user authentication, this would be ObjectId and reference User model
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries by campaign date range
MarketingExpenseSchema.index({ startDate: 1, endDate: 1 });

// Virtual property to calculate ROI
MarketingExpenseSchema.virtual('roi').get(function() {
  if (this.adSpend === 0) return 0;
  return ((this.revenueGenerated - this.adSpend) / this.adSpend) * 100;
});

// Virtual property to calculate conversion rate
MarketingExpenseSchema.virtual('conversionRate').get(function() {
  if (this.clicks === 0) return 0;
  return (this.conversions / this.clicks) * 100;
});

export default mongoose.models.MarketingExpense || mongoose.model<IMarketingExpense>('MarketingExpense', MarketingExpenseSchema);