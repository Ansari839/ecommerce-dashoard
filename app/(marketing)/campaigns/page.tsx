'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, BarChart3, Eye, Edit, Trash2, TrendingUp, Target, MousePointerClick } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface MarketingCampaign {
  _id: string;
  platform: string;
  campaignName: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  metrics: {
    ctr: number;
    conversionRate: number;
    cpc: number;
    roas: number;
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);
  const [formData, setFormData] = useState({
    platform: 'Meta',
    campaignName: '',
    budget: 1000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    status: 'draft'
  });

  useEffect(() => {
    // Simulate fetching campaigns from API
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      // In a real app, fetch campaigns from the API
      // const response = await fetch('/api/marketing/campaigns');
      // const data = await response.json();
      // setCampaigns(data.data.campaigns);
      
      // Mock data
      const mockCampaigns: MarketingCampaign[] = [
        {
          _id: '1',
          platform: 'Meta',
          campaignName: 'Summer Sale Campaign',
          budget: 5000,
          spent: 3200,
          impressions: 125000,
          clicks: 3500,
          conversions: 245,
          startDate: '2023-06-01',
          endDate: '2023-06-30',
          status: 'active',
          metrics: {
            ctr: 2.8,
            conversionRate: 7.0,
            cpc: 0.91,
            roas: 3.2
          }
        },
        {
          _id: '2',
          platform: 'Google',
          campaignName: 'New Product Launch',
          budget: 8000,
          spent: 6500,
          impressions: 220000,
          clicks: 4200,
          conversions: 180,
          startDate: '2023-05-15',
          endDate: '2023-07-15',
          status: 'active',
          metrics: {
            ctr: 1.9,
            conversionRate: 4.3,
            cpc: 1.55,
            roas: 2.1
          }
        },
        {
          _id: '3',
          platform: 'TikTok',
          campaignName: 'Brand Awareness',
          budget: 3000,
          spent: 2800,
          impressions: 850000,
          clicks: 12500,
          conversions: 95,
          startDate: '2023-05-01',
          endDate: '2023-05-31',
          status: 'completed',
          metrics: {
            ctr: 1.5,
            conversionRate: 0.8,
            cpc: 0.22,
            roas: 1.8
          }
        }
      ];
      
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, send the form data to your API
      // const response = await fetch('/api/marketing/campaigns', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate success
      const newCampaign: MarketingCampaign = {
        _id: (campaigns.length + 1).toString(),
        ...formData,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        status: 'draft',
        metrics: {
          ctr: 0,
          conversionRate: 0,
          cpc: 0,
          roas: 0
        }
      };
      
      setCampaigns([...campaigns, newCampaign]);
      setIsDialogOpen(false);
      setFormData({
        platform: 'Meta',
        campaignName: '',
        budget: 1000,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft'
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    
    try {
      // In a real app, send the form data to your API
      // const response = await fetch(`/api/marketing/campaigns/${selectedCampaign._id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Update the campaign in the local state
      setCampaigns(campaigns.map(camp => 
        camp._id === selectedCampaign._id ? { ...camp, ...formData } : camp
      ));
      
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      // In a real app, delete the campaign via API
      // await fetch(`/api/marketing/campaigns/${id}`, { method: 'DELETE' });
      
      setCampaigns(campaigns.filter(camp => camp._id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Meta': return 'bg-blue-100 text-blue-800';
      case 'Google': return 'bg-red-100 text-red-800';
      case 'TikTok': return 'bg-black text-white';
      case 'X': return 'bg-gray-900 text-white';
      case 'Instagram': return 'bg-pink-100 text-pink-800';
      case 'LinkedIn': return 'bg-blue-200 text-blue-900';
      case 'YouTube': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Marketing Campaigns</h1>
          <p className="text-gray-600">Manage and track your ad campaigns across platforms</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up your new marketing campaign with the required details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCampaign}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="platform">Platform</label>
                  <select
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="Meta">Meta (Facebook/Instagram)</option>
                    <option value="Google">Google Ads</option>
                    <option value="TikTok">TikTok Ads</option>
                    <option value="X">X Ads (Twitter)</option>
                    <option value="LinkedIn">LinkedIn Ads</option>
                    <option value="YouTube">YouTube Ads</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="campaignName">Campaign Name</label>
                  <Input
                    id="campaignName"
                    value={formData.campaignName}
                    onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="budget">Budget ($)</label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="startDate">Start Date</label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="endDate">End Date</label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Campaign
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns
                    .filter(camp => camp.status === 'active')
                    .map((campaign) => (
                      <TableRow key={campaign._id}>
                        <TableCell className="font-medium">
                          <div>{campaign.campaignName}</div>
                          <div className="text-sm text-gray-500">
                            {format(parseISO(campaign.startDate), 'MMM dd, yyyy')} - {format(parseISO(campaign.endDate), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPlatformColor(campaign.platform)}>
                            {campaign.platform}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-sm font-medium">{campaign.metrics.ctr.toFixed(2)}%</div>
                              <div className="text-xs text-gray-500">CTR</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">{campaign.metrics.conversionRate.toFixed(2)}%</div>
                              <div className="text-xs text-gray-500">CR</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">${campaign.metrics.cpc.toFixed(2)}</div>
                              <div className="text-xs text-gray-500">CPC</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>${campaign.spent.toLocaleString()}/${campaign.budget.toLocaleString()}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%` }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setFormData({
                                  platform: campaign.platform,
                                  campaignName: campaign.campaignName,
                                  budget: campaign.budget,
                                  startDate: campaign.startDate.split('T')[0],
                                  endDate: campaign.endDate.split('T')[0],
                                  status: campaign.status
                                });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteCampaign(campaign._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign._id}>
                      <TableCell className="font-medium">
                        <div>{campaign.campaignName}</div>
                        <div className="text-sm text-gray-500">
                          {format(parseISO(campaign.startDate), 'MMM dd, yyyy')} - {format(parseISO(campaign.endDate), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlatformColor(campaign.platform)}>
                          {campaign.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium">{campaign.metrics.ctr.toFixed(2)}%</div>
                            <div className="text-xs text-gray-500">CTR</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{campaign.metrics.conversionRate.toFixed(2)}%</div>
                            <div className="text-xs text-gray-500">CR</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">${campaign.metrics.cpc.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">CPC</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>${campaign.spent.toLocaleString()}/${campaign.budget.toLocaleString()}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%` }}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setFormData({
                                platform: campaign.platform,
                                campaignName: campaign.campaignName,
                                budget: campaign.budget,
                                startDate: campaign.startDate.split('T')[0],
                                endDate: campaign.endDate.split('T')[0],
                                status: campaign.status
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteCampaign(campaign._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}