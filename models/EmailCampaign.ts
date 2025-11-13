import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailCampaign extends Document {
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailCampaignSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [100, 'Campaign name cannot exceed 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Email subject is required'],
    trim: true,
    maxlength: [150, 'Subject cannot exceed 150 characters']
  },
  content: {
    type: String,
    required: [true, 'Email content is required'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'scheduled', 'sent', 'cancelled'],
      message: 'Status must be either draft, scheduled, sent, or cancelled'
    },
    default: 'draft'
  },
  recipients: {
    type: Number,
    default: 0,
    min: [0, 'Recipients count cannot be negative']
  },
  sent: {
    type: Number,
    default: 0,
    min: [0, 'Sent count cannot be negative']
  },
  opened: {
    type: Number,
    default: 0,
    min: [0, 'Opened count cannot be negative']
  },
  clicked: {
    type: Number,
    default: 0,
    min: [0, 'Clicked count cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create text index for search functionality
EmailCampaignSchema.index({ name: 'text', subject: 'text' });

export default mongoose.models.EmailCampaign || mongoose.model<IEmailCampaign>('EmailCampaign', EmailCampaignSchema);