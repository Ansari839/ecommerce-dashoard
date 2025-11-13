/**
 * Calculate Return on Ad Spend (ROAS)
 * @param revenue - Revenue generated from ads
 * @param spend - Amount spent on ads
 * @returns ROAS value
 */
export function calculateROAS(revenue: number, spend: number): number {
  if (spend === 0) return 0;
  return revenue / spend;
}

/**
 * Calculate Click-Through Rate (CTR)
 * @param clicks - Number of clicks
 * @param impressions - Number of impressions
 * @returns CTR percentage
 */
export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

/**
 * Calculate Conversion Rate
 * @param conversions - Number of conversions
 * @param clicks - Number of clicks
 * @returns Conversion rate percentage
 */
export function calculateConversionRate(conversions: number, clicks: number): number {
  if (clicks === 0) return 0;
  return (conversions / clicks) * 100;
}

/**
 * Calculate Cost Per Click (CPC)
 * @param spend - Total ad spend
 * @param clicks - Number of clicks
 * @returns CPC value
 */
export function calculateCPC(spend: number, clicks: number): number {
  if (clicks === 0) return 0;
  return spend / clicks;
}

/**
 * Calculate Cost Per Acquisition (CPA)
 * @param spend - Total ad spend
 * @param conversions - Number of conversions
 * @returns CPA value
 */
export function calculateCPA(spend: number, conversions: number): number {
  if (conversions === 0) return 0;
  return spend / conversions;
}

/**
 * Calculate Engagement Rate
 * @param engagements - Number of engagements (likes, shares, comments)
 * @param impressions - Number of impressions
 * @returns Engagement rate percentage
 */
export function calculateEngagementRate(engagements: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (engagements / impressions) * 100;
}