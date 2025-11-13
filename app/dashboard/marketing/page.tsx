'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CouponsTable, ICoupon } from '@/components/dashboard/marketing/CouponsTable';
import { FlashSalesTable, IFlashSale } from '@/components/dashboard/marketing/FlashSalesTable';
import { EmailCampaignsTable, IEmailCampaign } from '@/components/dashboard/marketing/EmailCampaignsTable';
import { AddCouponModal } from '@/components/dashboard/marketing/AddCouponModal';
import { AddFlashSaleModal } from '@/components/dashboard/marketing/AddFlashSaleModal';

export default function MarketingPage() {
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // State for tabs
  const [activeTab, setActiveTab] = useState<string>('coupons');
  
  // State for data
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [flashSales, setFlashSales] = useState<IFlashSale[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<IEmailCampaign[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);
  const [isFlashSaleModalOpen, setIsFlashSaleModalOpen] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);
  const [editingFlashSale, setEditingFlashSale] = useState<IFlashSale | null>(null);
  
  // Refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Fetch data based on active tab and filters
  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        params.append('status', statusFilter);
        if (searchTerm) params.append('search', searchTerm);
        
        switch (activeTab) {
          case 'coupons':
            const couponsResponse = await fetch(`/api/marketing?resource=coupons&${params.toString()}`);
            if (!couponsResponse.ok) throw new Error('Failed to fetch coupons');
            const couponsData = await couponsResponse.json();
            setCoupons(couponsData.success ? couponsData.data : []);
            break;
            
          case 'flash-sales':
            const flashSalesResponse = await fetch(`/api/marketing?resource=flash-sales&${params.toString()}`);
            if (!flashSalesResponse.ok) throw new Error('Failed to fetch flash sales');
            const flashSalesData = await flashSalesResponse.json();
            setFlashSales(flashSalesData.success ? flashSalesData.data : []);
            break;
            
          case 'email-campaigns':
            const emailCampaignsResponse = await fetch(`/api/marketing?resource=email-campaigns&${params.toString()}`);
            if (!emailCampaignsResponse.ok) throw new Error('Failed to fetch email campaigns');
            const emailCampaignsData = await emailCampaignsResponse.json();
            setEmailCampaigns(emailCampaignsData.success ? emailCampaignsData.data : []);
            break;
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
        console.error('Error fetching marketing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketingData();
  }, [activeTab, statusFilter, searchTerm, refreshTrigger]);

  // Handle saving a coupon
  const handleSaveCoupon = async (coupon: ICoupon) => {
    try {
      const endpoint = coupon._id ? `/api/marketing` : `/api/marketing`;
      const method = coupon._id ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource: 'coupons',
          id: coupon._id,
          data: {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minimumOrderAmount: coupon.minimumOrderAmount,
            startDate: coupon.startDate,
            endDate: coupon.endDate,
            maxUses: coupon.maxUses,
            isActive: coupon.isActive,
            usageLimitPerUser: coupon.usageLimitPerUser
          }
        })
      });

      if (!response.ok) throw new Error('Failed to save coupon');
      
      setIsCouponModalOpen(false);
      setEditingCoupon(null);
      setRefreshTrigger(prev => prev + 1); // Trigger a refresh
    } catch (err) {
      console.error('Error saving coupon:', err);
      setError('Failed to save coupon');
    }
  };

  // Handle saving a flash sale
  const handleSaveFlashSale = async (flashSale: IFlashSale) => {
    try {
      const endpoint = flashSale._id ? `/api/marketing` : `/api/marketing`;
      const method = flashSale._id ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource: 'flash-sales',
          id: flashSale._id,
          data: {
            title: flashSale.title,
            description: flashSale.description,
            productId: flashSale.productId,
            discountPercentage: flashSale.discountPercentage,
            salePrice: flashSale.salePrice,
            originalPrice: flashSale.originalPrice,
            startDate: flashSale.startDate,
            endDate: flashSale.endDate,
            maxQuantity: flashSale.maxQuantity,
            remainingQuantity: flashSale.remainingQuantity
          }
        })
      });

      if (!response.ok) throw new Error('Failed to save flash sale');
      
      setIsFlashSaleModalOpen(false);
      setEditingFlashSale(null);
      setRefreshTrigger(prev => prev + 1); // Trigger a refresh
    } catch (err) {
      console.error('Error saving flash sale:', err);
      setError('Failed to save flash sale');
    }
  };

  // Handle deleting a coupon
  const handleDeleteCoupon = async (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      try {
        const response = await fetch(`/api/marketing?resource=coupons&id=${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete coupon');
        
        setRefreshTrigger(prev => prev + 1); // Trigger a refresh
      } catch (err) {
        console.error('Error deleting coupon:', err);
        setError('Failed to delete coupon');
      }
    }
  };

  // Handle deleting a flash sale
  const handleDeleteFlashSale = async (id: string) => {
    if (confirm('Are you sure you want to delete this flash sale?')) {
      try {
        const response = await fetch(`/api/marketing?resource=flash-sales&id=${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete flash sale');
        
        setRefreshTrigger(prev => prev + 1); // Trigger a refresh
      } catch (err) {
        console.error('Error deleting flash sale:', err);
        setError('Failed to delete flash sale');
      }
    }
  };

  // Handle deleting an email campaign
  const handleDeleteCampaign = async (id: string) => {
    if (confirm('Are you sure you want to delete this email campaign?')) {
      try {
        const response = await fetch(`/api/marketing?resource=email-campaigns&id=${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete email campaign');
        
        setRefreshTrigger(prev => prev + 1); // Trigger a refresh
      } catch (err) {
        console.error('Error deleting email campaign:', err);
        setError('Failed to delete email campaign');
      }
    }
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'coupons':
        return (
          <CouponsTable
            coupons={coupons}
            loading={loading}
            error={error}
            onEdit={(coupon) => {
              setEditingCoupon(coupon);
              setIsCouponModalOpen(true);
            }}
            onDelete={handleDeleteCoupon}
            onAddNew={() => {
              setEditingCoupon(null);
              setIsCouponModalOpen(true);
            }}
          />
        );
      case 'flash-sales':
        return (
          <FlashSalesTable
            flashSales={flashSales}
            loading={loading}
            error={error}
            onEdit={(flashSale) => {
              setEditingFlashSale(flashSale);
              setIsFlashSaleModalOpen(true);
            }}
            onDelete={handleDeleteFlashSale}
            onAddNew={() => {
              setEditingFlashSale(null);
              setIsFlashSaleModalOpen(true);
            }}
          />
        );
      case 'email-campaigns':
        return (
          <EmailCampaignsTable
            campaigns={emailCampaigns}
            loading={loading}
            error={error}
            onEdit={(campaign) => console.log('Edit campaign:', campaign)}
            onDelete={handleDeleteCampaign}
            onAddNew={() => console.log('Add new campaign')}
            onSend={(id) => console.log('Sending campaign:', id)}
          />
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Marketing & Promotions</h1>
          <p className="text-muted-foreground mt-1">Manage discounts, flash sales, and campaigns</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-80">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <Button
          variant={activeTab === 'coupons' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('coupons')}
          className="mr-2"
        >
          Discount Codes
        </Button>
        <Button
          variant={activeTab === 'flash-sales' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('flash-sales')}
          className="mr-2"
        >
          Flash Sales
        </Button>
        <Button
          variant={activeTab === 'email-campaigns' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('email-campaigns')}
          className="mr-2"
        >
          Email Campaigns
        </Button>
        <Button
          variant={activeTab === 'deal-of-day' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('deal-of-day')}
          className="mr-2"
        >
          Deal of the Day
        </Button>
        <Button
          variant={activeTab === 'upsell-crosssell' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('upsell-crosssell')}
        >
          Upsell / Cross-sell
        </Button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Modals */}
      {isCouponModalOpen && (
        <AddCouponModal
          isOpen={isCouponModalOpen}
          onClose={() => {
            setIsCouponModalOpen(false);
            setEditingCoupon(null);
          }}
          coupon={editingCoupon || undefined}
          onSave={handleSaveCoupon}
        />
      )}

      {isFlashSaleModalOpen && (
        <AddFlashSaleModal
          isOpen={isFlashSaleModalOpen}
          onClose={() => {
            setIsFlashSaleModalOpen(false);
            setEditingFlashSale(null);
          }}
          flashSale={editingFlashSale || undefined}
          onSave={handleSaveFlashSale}
        />
      )}
    </div>
  );
}