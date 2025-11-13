import { IMarketingExpense } from '@/models/MarketingExpense';

/**
 * Calculate ROI (Return on Investment) for a marketing campaign
 * @param campaign The marketing expense object
 * @returns ROI percentage
 */
export function calculateROI(campaign: IMarketingExpense): number {
  if (campaign.adSpend === 0) {
    return 0;
  }
  return ((campaign.revenueGenerated - campaign.adSpend) / campaign.adSpend) * 100;
}

/**
 * Calculate conversion rate for a marketing campaign
 * @param campaign The marketing expense object
 * @returns Conversion rate percentage
 */
export function calculateConversionRate(campaign: IMarketingExpense): number {
  if (campaign.clicks === 0) {
    return 0;
  }
  return (campaign.conversions / campaign.clicks) * 100;
}

/**
 * Calculate cost per acquisition for a marketing campaign
 * @param campaign The marketing expense object
 * @returns Cost per acquisition
 */
export function calculateCPA(campaign: IMarketingExpense): number {
  if (campaign.conversions === 0) {
    return 0;
  }
  return campaign.adSpend / campaign.conversions;
}

/**
 * Calculate cost per click for a marketing campaign
 * @param campaign The marketing expense object
 * @returns Cost per click
 */
export function calculateCPC(campaign: IMarketingExpense): number {
  if (campaign.clicks === 0) {
    return 0;
  }
  return campaign.adSpend / campaign.clicks;
}