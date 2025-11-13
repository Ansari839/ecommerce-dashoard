import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';
import FlashSale from '@/models/FlashSale';
import EmailCampaign from '@/models/EmailCampaign';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

// Get all coupons
export async function getAllCoupons(status?: string, search?: string) {
  try {
    await connectDB();

    let query: any = {};
    
    // Add status filter if provided
    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = true;
        query.startDate = { $lte: new Date() };
        query.endDate = { $gte: new Date() };
      } else if (status === 'expired') {
        query.endDate = { $lt: new Date() };
      } else if (status === 'scheduled') {
        query.startDate = { $gt: new Date() };
      }
    }
    
    // Add search filter if provided
    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });

    return success(coupons, MESSAGES.COUPONS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching coupons:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Create a new coupon
export async function createCoupon(couponData: any) {
  try {
    await connectDB();

    // Validate that the code doesn't already exist
    const existingCoupon = await Coupon.findOne({ code: couponData.code.toUpperCase() });
    if (existingCoupon) {
      return error(MESSAGES.COUPON_CODE_EXISTS);
    }

    // Create the coupon
    const coupon = new Coupon({
      ...couponData,
      code: couponData.code.toUpperCase()
    });
    const savedCoupon = await coupon.save();

    return success(savedCoupon, MESSAGES.COUPON_CREATED);
  } catch (err: any) {
    console.error('Error creating coupon:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Update a coupon
export async function updateCoupon(id: string, couponData: any) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Check if the coupon exists
    const existingCoupon = await Coupon.findById(id);
    if (!existingCoupon) {
      return error(MESSAGES.COUPON_NOT_FOUND);
    }

    // Check if the new code already exists (for different coupon)
    if (couponData.code && couponData.code.toUpperCase() !== existingCoupon.code) {
      const duplicateCode = await Coupon.findOne({ 
        code: couponData.code.toUpperCase(),
        _id: { $ne: id }
      });
      if (duplicateCode) {
        return error(MESSAGES.COUPON_CODE_EXISTS);
      }
    }

    // Update the coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { ...couponData, code: couponData.code?.toUpperCase() || existingCoupon.code },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return error(MESSAGES.COUPON_UPDATE_FAILED);
    }

    return success(updatedCoupon, MESSAGES.COUPON_UPDATED);
  } catch (err: any) {
    console.error('Error updating coupon:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Delete a coupon
export async function deleteCoupon(id: string) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return error(MESSAGES.COUPON_NOT_FOUND);
    }

    return success(null, MESSAGES.COUPON_DELETED);
  } catch (err: any) {
    console.error('Error deleting coupon:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get all flash sales
export async function getAllFlashSales(status?: string, search?: string) {
  try {
    await connectDB();

    let query: any = {};
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Add search filter if provided
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const flashSales = await FlashSale.find(query).sort({ createdAt: -1 });

    return success(flashSales, MESSAGES.FLASH_SALES_FETCHED);
  } catch (err: any) {
    console.error('Error fetching flash sales:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Create a new flash sale
export async function createFlashSale(flashSaleData: any) {
  try {
    await connectDB();

    // Create the flash sale
    const flashSale = new FlashSale(flashSaleData);
    const savedFlashSale = await flashSale.save();

    return success(savedFlashSale, MESSAGES.FLASH_SALE_CREATED);
  } catch (err: any) {
    console.error('Error creating flash sale:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Update a flash sale
export async function updateFlashSale(id: string, flashSaleData: any) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Check if the flash sale exists
    const existingFlashSale = await FlashSale.findById(id);
    if (!existingFlashSale) {
      return error(MESSAGES.FLASH_SALE_NOT_FOUND);
    }

    // Update the flash sale
    const updatedFlashSale = await FlashSale.findByIdAndUpdate(
      id,
      flashSaleData,
      { new: true, runValidators: true }
    );

    if (!updatedFlashSale) {
      return error(MESSAGES.FLASH_SALE_UPDATE_FAILED);
    }

    return success(updatedFlashSale, MESSAGES.FLASH_SALE_UPDATED);
  } catch (err: any) {
    console.error('Error updating flash sale:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Delete a flash sale
export async function deleteFlashSale(id: string) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedFlashSale = await FlashSale.findByIdAndDelete(id);

    if (!deletedFlashSale) {
      return error(MESSAGES.FLASH_SALE_NOT_FOUND);
    }

    return success(null, MESSAGES.FLASH_SALE_DELETED);
  } catch (err: any) {
    console.error('Error deleting flash sale:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Get all email campaigns
export async function getAllEmailCampaigns(status?: string, search?: string) {
  try {
    await connectDB();

    let query: any = {};
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Add search filter if provided
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const campaigns = await EmailCampaign.find(query).sort({ createdAt: -1 });

    return success(campaigns, MESSAGES.EMAIL_CAMPAIGNS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching email campaigns:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Create a new email campaign
export async function createEmailCampaign(campaignData: any) {
  try {
    await connectDB();

    // Create the email campaign
    const campaign = new EmailCampaign(campaignData);
    const savedCampaign = await campaign.save();

    return success(savedCampaign, MESSAGES.EMAIL_CAMPAIGN_CREATED);
  } catch (err: any) {
    console.error('Error creating email campaign:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Update an email campaign
export async function updateEmailCampaign(id: string, campaignData: any) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    // Check if the campaign exists
    const existingCampaign = await EmailCampaign.findById(id);
    if (!existingCampaign) {
      return error(MESSAGES.EMAIL_CAMPAIGN_NOT_FOUND);
    }

    // Update the campaign
    const updatedCampaign = await EmailCampaign.findByIdAndUpdate(
      id,
      campaignData,
      { new: true, runValidators: true }
    );

    if (!updatedCampaign) {
      return error(MESSAGES.EMAIL_CAMPAIGN_UPDATE_FAILED);
    }

    return success(updatedCampaign, MESSAGES.EMAIL_CAMPAIGN_UPDATED);
  } catch (err: any) {
    console.error('Error updating email campaign:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

// Delete an email campaign
export async function deleteEmailCampaign(id: string) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(MESSAGES.INVALID_ID);
    }

    const deletedCampaign = await EmailCampaign.findByIdAndDelete(id);

    if (!deletedCampaign) {
      return error(MESSAGES.EMAIL_CAMPAIGN_NOT_FOUND);
    }

    return success(null, MESSAGES.EMAIL_CAMPAIGN_DELETED);
  } catch (err: any) {
    console.error('Error deleting email campaign:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}