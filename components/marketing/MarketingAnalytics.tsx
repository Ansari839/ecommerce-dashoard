'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, MousePointerClick, Target, TrendingUpIcon } from 'lucide-react';

interface CampaignMetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  description?: string;
}

const CampaignMetricCard = ({ title, value, change, icon, description }: CampaignMetricCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
          )}
          <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}% from last period
          </span>
        </div>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
};

interface CampaignDetailsCardProps {
  campaign: {
    campaignName: string;
    platform: string;
    startDate: string;
    endDate: string;
    adSpend: number;
    clicks: number;
    conversions: number;
    revenueGenerated: number;
    metrics: {
      roi: number;
      conversionRate: number;
      cpa: number;
      cpc: number;
    };
  };
}

const CampaignDetailsCard = ({ campaign }: CampaignDetailsCardProps) => {
  const {
    campaignName,
    platform,
    startDate,
    endDate,
    adSpend,
    clicks,
    conversions,
    revenueGenerated,
    metrics
  } = campaign;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{campaignName}</CardTitle>
            <CardDescription className="mt-1">
              <Badge className="mr-2">{platform}</Badge>
              {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant="secondary">${adSpend.toLocaleString('en-US', {maximumFractionDigits: 2})}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Clicks</p>
            <p className="text-lg font-semibold">{clicks.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Conversions</p>
            <p className="text-lg font-semibold">{conversions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-lg font-semibold">${revenueGenerated.toLocaleString('en-US', {maximumFractionDigits: 2})}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ROI</p>
            <p className={`text-lg font-semibold ${metrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.roi.toFixed(2)}%
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-lg font-semibold">{metrics.conversionRate.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CPA</p>
            <p className="text-lg font-semibold">${metrics.cpa.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CPC</p>
            <p className="text-lg font-semibold">${metrics.cpc.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profit</p>
            <p className={`text-lg font-semibold ${revenueGenerated - adSpend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(revenueGenerated - adSpend).toLocaleString('en-US', {maximumFractionDigits: 2})}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CampaignComparisonProps {
  campaigns: {
    campaignName: string;
    adSpend: number;
    revenueGenerated: number;
    metrics: {
      roi: number;
      conversionRate: number;
    };
  }[];
}

const CampaignComparison = ({ campaigns }: CampaignComparisonProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Comparison</CardTitle>
        <CardDescription>Compare performance metrics across campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign, index) => (
            <div key={index} className="flex items-center justify-between pb-2 border-b last:border-0">
              <div className="w-1/3 font-medium">{campaign.campaignName}</div>
              <div className="w-1/4 text-right">
                <div>ROI: <span className={campaign.metrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}>{campaign.metrics.roi.toFixed(2)}%</span></div>
                <div className="text-xs text-muted-foreground">Conversion: {campaign.metrics.conversionRate.toFixed(2)}%</div>
              </div>
              <div className="w-1/4 text-right">
                <div>Spend: ${campaign.adSpend.toLocaleString('en-US', {maximumFractionDigits: 2})}</div>
                <div className="text-xs text-muted-foreground">Revenue: ${campaign.revenueGenerated.toLocaleString('en-US', {maximumFractionDigits: 2})}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { CampaignMetricCard, CampaignDetailsCard, CampaignComparison };