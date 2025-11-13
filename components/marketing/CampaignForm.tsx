'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, PlusCircle, Target, Wallet } from 'lucide-react';

interface CampaignFormProps {
  onSubmit: (campaignData: any) => void;
  onCancel: () => void;
  initialData?: any; // Optional initial data for editing
}

export function CampaignForm({ onSubmit, onCancel, initialData }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    platform: initialData?.platform || 'Meta',
    campaignName: initialData?.campaignName || '',
    budget: initialData?.budget || 1000,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    status: initialData?.status || 'draft',
    objectives: initialData?.objectives || 'traffic',
    targetAudience: initialData?.targetAudience || '',
    adCopy: initialData?.adCopy || '',
    mediaUrl: initialData?.mediaUrl || ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.campaignName) {
      newErrors.campaignName = 'Campaign name is required';
    }
    
    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }
    
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Campaign' : 'Create New Campaign'}</CardTitle>
        <CardDescription>
          {initialData 
            ? 'Update your marketing campaign details' 
            : 'Set up a new marketing campaign across social platforms'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => handleChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meta">Meta (Facebook/Instagram)</SelectItem>
                  <SelectItem value="Google">Google Ads</SelectItem>
                  <SelectItem value="TikTok">TikTok Ads</SelectItem>
                  <SelectItem value="X">X Ads (Twitter)</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn Ads</SelectItem>
                  <SelectItem value="YouTube">YouTube Ads</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={formData.campaignName}
                onChange={(e) => handleChange('campaignName', e.target.value)}
                placeholder="Name your campaign"
              />
              {errors.campaignName && <p className="text-sm text-red-500 mt-1">{errors.campaignName}</p>}
            </div>
            
            <div>
              <Label htmlFor="budget">Budget ($)</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', Number(e.target.value))}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
              {errors.budget && <p className="text-sm text-red-500 mt-1">{errors.budget}</p>}
            </div>
            
            <div>
              <Label htmlFor="objectives">Campaign Objective</Label>
              <Select value={formData.objectives} onValueChange={(value) => handleChange('objectives', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                  <SelectItem value="traffic">Website Traffic</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="leads">Lead Generation</SelectItem>
                  <SelectItem value="sales">Sales Conversions</SelectItem>
                  <SelectItem value="app_installs">App Installs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="pl-10"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="pl-10"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                placeholder="Describe your target audience (age, location, interests, etc.)"
                rows={3}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="adCopy">Ad Copy</Label>
              <Textarea
                id="adCopy"
                value={formData.adCopy}
                onChange={(e) => handleChange('adCopy', e.target.value)}
                placeholder="Enter your ad copy here"
                rows={4}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="mediaUrl">Media URL</Label>
              <Input
                id="mediaUrl"
                value={formData.mediaUrl}
                onChange={(e) => handleChange('mediaUrl', e.target.value)}
                placeholder="URL to image/video for the ad"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" />
              {initialData ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}