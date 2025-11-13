import mongoose, { Document, Schema } from 'mongoose';

export interface ISEOConfig extends Document {
  pageUrl: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  robots: string;
  lastUpdated: Date;
}

const SEOConfigSchema: Schema = new Schema({
  pageUrl: {
    type: String,
    required: [true, 'Page URL is required'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Page title is required'],
    maxlength: [60, 'Title should be under 60 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Meta description is required'],
    maxlength: [160, 'Description should be under 160 characters'],
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  ogTitle: {
    type: String,
    maxlength: [60, 'Open Graph title should be under 60 characters'],
    trim: true
  },
  ogDescription: {
    type: String,
    maxlength: [160, 'Open Graph description should be under 160 characters'],
    trim: true
  },
  ogImage: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.*\.(jpg|jpeg|png|webp|gif)$/i, 'Please enter a valid image URL']
  },
  twitterTitle: {
    type: String,
    maxlength: [60, 'Twitter title should be under 60 characters'],
    trim: true
  },
  twitterDescription: {
    type: String,
    maxlength: [160, 'Twitter description should be under 160 characters'],
    trim: true
  },
  twitterImage: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.*\.(jpg|jpeg|png|webp|gif)$/i, 'Please enter a valid image URL']
  },
  canonicalUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\//, 'Please enter a valid URL']
  },
  robots: {
    type: String,
    enum: ['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'],
    default: 'index, follow'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries by page URL
SEOConfigSchema.index({ pageUrl: 1 });

export default mongoose.models.SEOConfig || mongoose.model<ISEOConfig>('SEOConfig', SEOConfigSchema);