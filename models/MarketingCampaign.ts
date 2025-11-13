import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketingCampaign extends Document {
  platform: 'Meta' | 'Google' | 'TikTok' | 'X' | 'Instagram' | 'LinkedIn' | 'YouTube' | 'Other';
  campaignName: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'paused' | 'completed' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const MarketingCampaignSchema: Schema = new Schema({
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: ['Meta', 'Google', 'TikTok', 'X', 'Instagram', 'LinkedIn', 'YouTube', 'Other'],
    trim: true
  },
  campaignName: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [100, 'Campaign name cannot exceed 100 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative']
  },
  spent: {
    type: Number,
    required: [true, 'Spent amount is required'],
    min: [0, 'Spent amount cannot be negative'],
    default: 0
  },
  impressions: {
    type: Number,
    required: [true, 'Impressions is required'],
    min: [0, 'Impressions cannot be negative'],
    default: 0
  },
  clicks: {
    type: Number,
    required: [true, 'Clicks is required'],
    min: [0, 'Clicks cannot be negative'],
    default: 0
  },
  conversions: {
    type: Number,
    required: [true, 'Conversions is required'],
    min: [0, 'Conversions cannot be negative'],
    default: 0
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
    enum: ['active', 'paused', 'completed', 'draft'],
    default: 'draft'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries by platform and status
MarketingCampaignSchema.index({ platform: 1, status: 1 });
// Index for date range queries
MarketingCampaignSchema.index({ startDate: 1, endDate: 1 });

// Virtual property to calculate click-through rate
MarketingCampaignSchema.virtual('ctr').get(function() {
  if (this.impressions === 0) return 0;
  return (this.clicks / this.impressions) * 100;
});

// Virtual property to calculate conversion rate
MarketingCampaignSchema.virtual('conversionRate').get(function() {
  if (this.clicks === 0) return 0;
  return (this.conversions / this.clicks) * 100;
});

// Virtual property to calculate cost per click
MarketingCampaignSchema.virtual('cpc').get(function() {
  if (this.clicks === 0) return 0;
  return this.spent / this.clicks;
});

// Virtual property to calculate return on ad spend
MarketingCampaignSchema.virtual('roas').get(function() {
  if (this.spent === 0) return 0;
  return this.conversions / this.spent;
});

export default mongoose.models.MarketingCampaign || mongoose.model<IMarketingCampaign>('MarketingCampaign', MarketingCampaignSchema);