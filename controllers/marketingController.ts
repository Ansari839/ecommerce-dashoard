import { connectDB } from '@/lib/db';
import MarketingCampaign from '@/models/MarketingCampaign';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import { calculateROAS, calculateCTR, calculateConversionRate } from '@/helpers/adAnalytics';
import mongoose from 'mongoose';

/**
 * Create a new marketing campaign
 */
export async function createCampaign(campaignData: {
  platform: string;
  campaignName: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: Date;
  endDate: Date;
  status: string;
}) {
  try {
    await connectDB();

    // Validate date range
    if (new Date(campaignData.startDate) > new Date(campaignData.endDate)) {
      return error(MESSAGES.INVALID_DATE_RANGE);
    }

    const newCampaign = new MarketingCampaign(campaignData);
    const savedCampaign = await newCampaign.save();

    return success(savedCampaign, MESSAGES.MARKETING_CAMPAIGN_CREATED);
  } catch (err: any) {
    console.error('Error creating campaign:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Get all marketing campaigns with optional filters
 */
export async function getCampaigns(
  page: number = 1,
  limit: number = 10,
  filters: {
    platform?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}
) {
  try {
    await connectDB();

    // Build query object
    let query: any = {};

    // Add filters if provided
    if (filters.platform) {
      query.platform = filters.platform;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      query.startDate = {};
      if (filters.startDate) query.startDate.$gte = new Date(filters.startDate);
      if (filters.endDate) query.startDate.$lte = new Date(filters.endDate);
    }

    // Calculate total count for pagination
    const total = await MarketingCampaign.countDocuments(query);

    // Get campaigns with pagination
    const campaigns = await MarketingCampaign.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate metrics for each campaign
    const campaignsWithMetrics = campaigns.map(campaign => {
      return {
        ...campaign.toObject(),
        metrics: {
          ctr: calculateCTR(campaign.clicks, campaign.impressions),
          conversionRate: calculateConversionRate(campaign.conversions, campaign.clicks),
          cpc: campaign.clicks > 0 ? campaign.spent / campaign.clicks : 0,
          roas: calculateROAS(campaign.conversions, campaign.spent)
        }
      };
    });

    return success({
      campaigns: campaignsWithMetrics,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, MESSAGES.MARKETING_CAMPAIGNS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching campaigns:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Get a specific marketing campaign by ID
 */
export async function getCampaignById(id: string) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const campaign = await MarketingCampaign.findById(id);

    if (!campaign) {
      return error(MESSAGES.MARKETING_CAMPAIGN_NOT_FOUND);
    }

    // Calculate metrics for the campaign
    const metrics = {
      ctr: calculateCTR(campaign.clicks, campaign.impressions),
      conversionRate: calculateConversionRate(campaign.conversions, campaign.clicks),
      cpc: campaign.clicks > 0 ? campaign.spent / campaign.clicks : 0,
      roas: calculateROAS(campaign.conversions, campaign.spent)
    };

    return success({
      ...campaign.toObject(),
      metrics
    }, MESSAGES.MARKETING_CAMPAIGN_FETCHED);
  } catch (err: any) {
    console.error('Error fetching campaign:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Update an existing marketing campaign
 */
export async function updateCampaign(id: string, campaignData: Partial<{
  platform: string;
  campaignName: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: Date;
  endDate: Date;
  status: string;
}>) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Validate date range if dates are being updated
    if (campaignData.startDate || campaignData.endDate) {
      const campaign = await MarketingCampaign.findById(id);
      if (!campaign) {
        return error(MESSAGES.MARKETING_CAMPAIGN_NOT_FOUND);
      }

      const startDate = campaignData.startDate || campaign.startDate;
      const endDate = campaignData.endDate || campaign.endDate;

      if (new Date(startDate as Date) > new Date(endDate as Date)) {
        return error(MESSAGES.INVALID_DATE_RANGE);
      }
    }

    const updatedCampaign = await MarketingCampaign.findByIdAndUpdate(
      id,
      campaignData,
      { new: true, runValidators: true } // Return updated document and run validations
    );

    if (!updatedCampaign) {
      return error(MESSAGES.MARKETING_CAMPAIGN_NOT_FOUND);
    }

    // Calculate metrics for the updated campaign
    const metrics = {
      ctr: calculateCTR(updatedCampaign.clicks, updatedCampaign.impressions),
      conversionRate: calculateConversionRate(updatedCampaign.conversions, updatedCampaign.clicks),
      cpc: updatedCampaign.clicks > 0 ? updatedCampaign.spent / updatedCampaign.clicks : 0,
      roas: calculateROAS(updatedCampaign.conversions, updatedCampaign.spent)
    };

    return success({
      ...updatedCampaign.toObject(),
      metrics
    }, MESSAGES.MARKETING_CAMPAIGN_UPDATED);
  } catch (err: any) {
    console.error('Error updating campaign:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Delete a marketing campaign
 */
export async function deleteCampaign(id: string) {
  try {
    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedCampaign = await MarketingCampaign.findByIdAndDelete(id);

    if (!deletedCampaign) {
      return error(MESSAGES.MARKETING_CAMPAIGN_NOT_FOUND);
    }

    return success(null, MESSAGES.MARKETING_CAMPAIGN_DELETED);
  } catch (err: any) {
    console.error('Error deleting campaign:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Sync metadata from external platforms
 */
export async function syncMetaData() {
  try {
    await connectDB();
    
    // This is a placeholder for the actual implementation
    // In a real application, this would connect to external APIs like:
    // - Meta Pixel API
    // - Google Ads API
    // - TikTok Ads API
    // - etc.
    
    // For now, we'll return a success message
    return success({ synced: true }, MESSAGES.METADATA_SYNCED);
  } catch (err: any) {
    console.error('Error syncing metadata:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Fetch analytics data from external platforms
 */
export async function fetchAnalytics(campaignId: string, platform: string) {
  try {
    await connectDB();
    
    // This is a placeholder for the actual implementation
    // In a real application, this would connect to external APIs
    // to fetch real-time analytics data
    
    // For now, we'll return a mock response with basic info
    const campaign = await MarketingCampaign.findById(campaignId);
    
    if (!campaign) {
      return error(MESSAGES.MARKETING_CAMPAIGN_NOT_FOUND);
    }

    // Mock analytics data
    const analyticsData = {
      campaignId,
      platform,
      impressions: campaign.impressions,
      clicks: campaign.clicks,
      conversions: campaign.conversions,
      spent: campaign.spent,
      dateRange: {
        start: campaign.startDate,
        end: campaign.endDate
      }
    };

    return success(analyticsData, MESSAGES.ANALYTICS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching analytics:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}