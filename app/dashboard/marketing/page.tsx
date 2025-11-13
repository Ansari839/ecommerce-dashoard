'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointerClick, 
  Target, 
  DollarSign, 
  Users, 
  Calendar,
  PlusCircle
} from 'lucide-react';
import { SocialLinks } from '@/components/marketing/SocialLinks';
import { SEOManager } from '@/components/marketing/SEOManager';
import { format, subDays } from 'date-fns';

interface CampaignInsight {
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  roas: number;
}

interface SocialMetric {
  platform: string;
  followers: number;
  engagements: number;
  reach: number;
}

export default function MarketingDashboard() {
  const [campaignInsights, setCampaignInsights] = useState<CampaignInsight[]>([]);
  const [socialMetrics, setSocialMetrics] = useState<SocialMetric[]>([]);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    // Simulate fetching marketing data
    fetchMarketingData();
  }, [dateRange]);

  const fetchMarketingData = () => {
    // Mock data - in a real app, this would come from your API
    setCampaignInsights([
      {
        platform: 'Meta',
        impressions: 250000,
        clicks: 4200,
        conversions: 180,
        spend: 3200,
        ctr: 1.68,
        roas: 3.2
      },
      {
        platform: 'Google',
        impressions: 180000,
        clicks: 3200,
        conversions: 150,
        spend: 2800,
        ctr: 1.78,
        roas: 2.8
      },
      {
        platform: 'TikTok',
        impressions: 500000,
        clicks: 12500,
        conversions: 95,
        spend: 1800,
        ctr: 2.5,
        roas: 1.9
      }
    ]);

    setSocialMetrics([
      {
        platform: 'Facebook',
        followers: 12500,
        engagements: 2800,
        reach: 45000
      },
      {
        platform: 'Instagram',
        followers: 8500,
        engagements: 3500,
        reach: 32000
      },
      {
        platform: 'Twitter',
        followers: 5200,
        engagements: 1200,
        reach: 18000
      }
    ]);
  };

  // Calculate totals
  const totalImpressions = campaignInsights.reduce((sum, camp) => sum + camp.impressions, 0);
  const totalClicks = campaignInsights.reduce((sum, camp) => sum + camp.clicks, 0);
  const totalConversions = campaignInsights.reduce((sum, camp) => sum + camp.conversions, 0);
  const totalSpend = campaignInsights.reduce((sum, camp) => sum + camp.spend, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const totalROAS = totalSpend > 0 ? (totalConversions * 50) / totalSpend : 0; // Assuming $50 average order value

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart3 className="mr-3 h-8 w-8" />
            Marketing Dashboard
          </h1>
          <p className="text-muted-foreground">Track and analyze your marketing performance</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Optimized spend</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROAS</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalROAS.toFixed(2)}x</div>
            <p className="text-xs text-muted-foreground">Return on ad spend</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Campaign Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Campaign Performance</CardTitle>
                <Badge variant="outline">By Platform</Badge>
              </div>
              <CardDescription>
                Performance metrics across your marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaignInsights.map((campaign, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Badge className="mr-3">{campaign.platform}</Badge>
                        <span className="font-medium">Campaign #{index + 1}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${campaign.spend.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Spent</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div>
                        <div className="text-sm font-medium">{campaign.impressions.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Impressions</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{campaign.clicks.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Clicks</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{campaign.ctr.toFixed(2)}%</div>
                        <div className="text-xs text-muted-foreground">CTR</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{campaign.roas.toFixed(2)}x</div>
                        <div className="text-xs text-muted-foreground">ROAS</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Metrics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Social Reach</CardTitle>
              <CardDescription>
                Your social media performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {socialMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge className="mr-3">{metric.platform}</Badge>
                      <div>
                        <div className="font-medium">{metric.followers.toLocaleString()} followers</div>
                        <div className="text-xs text-muted-foreground">{metric.engagements.toLocaleString()} engagements</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{metric.reach.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Reach</div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4">
                  <h3 className="font-medium mb-3">Connected Social Accounts</h3>
                  <SocialLinks />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Configuration */}
        <SEOManager />
        
        {/* Analytics Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Key metrics from Google Analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">4,521</div>
                <div className="text-sm text-muted-foreground">Sessions</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">2.34%</div>
                <div className="text-sm text-muted-foreground">Bounce Rate</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">00:02:45</div>
                <div className="text-sm text-muted-foreground">Avg. Session</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">34.2%</div>
                <div className="text-sm text-muted-foreground">New Visitors</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Traffic Sources</h3>
                <span className="text-sm text-muted-foreground">Last 30 days</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Organic Search</span>
                    <span>52%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '52%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Social Media</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Direct</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Referrals</span>
                    <span>5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}