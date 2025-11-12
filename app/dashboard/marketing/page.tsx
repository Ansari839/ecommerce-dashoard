'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CampaignTable } from '@/components/dashboard/CampaignTable';
import { AddCampaignModal } from '@/components/dashboard/AddCampaignModal';
import { Plus } from 'lucide-react';

// Define the Campaign type
interface Campaign {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}

export default function MarketingPage() {
  // Static sample campaign data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: 1, name: 'Summer Sale', type: 'Discount', startDate: '2023-06-01', endDate: '2023-08-31', status: 'active' },
    { id: 2, name: 'Back to School', type: 'Promotion', startDate: '2023-08-15', endDate: '2023-09-30', status: 'active' },
    { id: 3, name: 'Holiday Special', type: 'Discount', startDate: '2023-11-20', endDate: '2023-12-31', status: 'inactive' },
    { id: 4, name: 'New Customer Welcome', type: 'Loyalty Program', startDate: '2023-01-01', endDate: '2023-12-31', status: 'active' },
    { id: 5, name: 'Newsletter Campaign', type: 'Email', startDate: '2023-02-01', endDate: '2023-05-31', status: 'inactive' },
    { id: 6, name: 'Black Friday', type: 'Discount', startDate: '2023-11-01', endDate: '2023-11-30', status: 'active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCampaign = (campaignData: Campaign) => {
    setCampaigns([campaignData, ...campaigns]);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    console.log('Edit campaign:', campaign);
    // In a real implementation, you would open the modal with the campaign data
  };

  const handleDeleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Marketing Management</h1>
          <p className="text-muted-foreground mt-1">Manage your marketing campaigns and promotions</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Campaign
        </Button>
      </div>

      <CampaignTable 
        campaigns={campaigns}
        onEdit={handleEditCampaign}
        onDelete={handleDeleteCampaign}
      />

      <AddCampaignModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCampaign}
      />
    </div>
  );
}