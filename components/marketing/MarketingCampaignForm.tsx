'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MarketingCampaignFormProps {
  formData: {
    campaignName: string;
    platform: string;
    startDate: string;
    endDate: string;
    adSpend: number;
    clicks: number;
    conversions: number;
    revenueGenerated: number;
    createdBy: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    campaignName: string;
    platform: string;
    startDate: string;
    endDate: string;
    adSpend: number;
    clicks: number;
    conversions: number;
    revenueGenerated: number;
    createdBy: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
}

const MarketingCampaignForm = ({ formData, setFormData, onSubmit, isEdit = false }: MarketingCampaignFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="campaignName">Campaign Name</Label>
          <Input
            id="campaignName"
            value={formData.campaignName}
            onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="adSpend">Ad Spend ($)</Label>
          <Input
            id="adSpend"
            type="number"
            step="0.01"
            value={formData.adSpend}
            onChange={(e) => setFormData({ ...formData, adSpend: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="clicks">Clicks</Label>
          <Input
            id="clicks"
            type="number"
            value={formData.clicks}
            onChange={(e) => setFormData({ ...formData, clicks: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="conversions">Conversions</Label>
          <Input
            id="conversions"
            type="number"
            value={formData.conversions}
            onChange={(e) => setFormData({ ...formData, conversions: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="revenueGenerated">Revenue Generated ($)</Label>
          <Input
            id="revenueGenerated"
            type="number"
            step="0.01"
            value={formData.revenueGenerated}
            onChange={(e) => setFormData({ ...formData, revenueGenerated: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full md:w-auto">
        {isEdit ? 'Update Campaign' : 'Add Campaign'}
      </Button>
    </form>
  );
};

export default MarketingCampaignForm;