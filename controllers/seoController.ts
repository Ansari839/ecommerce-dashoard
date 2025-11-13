import { connectDB } from '@/lib/db';
import SEOConfig from '@/models/SEOConfig';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

/**
 * Get SEO configuration for a specific page
 */
export async function getSEOConfig(pageUrl: string) {
  try {
    await connectDB();

    const seoConfig = await SEOConfig.findOne({ pageUrl });

    if (!seoConfig) {
      // Return default SEO config if not found
      return success({
        pageUrl,
        title: 'Default Title',
        description: 'Default description for this page',
        keywords: [],
        ogTitle: 'Default Open Graph Title',
        ogDescription: 'Default Open Graph description',
        ogImage: '',
        twitterTitle: 'Default Twitter Title',
        twitterDescription: 'Default Twitter description',
        twitterImage: '',
        canonicalUrl: pageUrl,
        robots: 'index, follow'
      }, MESSAGES.SEO_CONFIG_DEFAULT);
    }

    return success(seoConfig, MESSAGES.SEO_CONFIG_FETCHED);
  } catch (err: any) {
    console.error('Error fetching SEO config:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Update SEO configuration for a specific page
 */
export async function updateSEOConfig(
  pageUrl: string,
  seoData: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonicalUrl?: string;
    robots?: string;
  }
) {
  try {
    await connectDB();

    // Check if configuration already exists
    let seoConfig = await SEOConfig.findOne({ pageUrl });
    
    if (seoConfig) {
      // Update existing configuration
      seoConfig = await SEOConfig.findOneAndUpdate(
        { pageUrl },
        { ...seoData, lastUpdated: new Date() },
        { new: true, runValidators: true }
      );
    } else {
      // Create new configuration
      seoConfig = new SEOConfig({
        pageUrl,
        ...seoData,
        lastUpdated: new Date()
      });
      await seoConfig.save();
    }

    return success(seoConfig, MESSAGES.SEO_CONFIG_UPDATED);
  } catch (err: any) {
    console.error('Error updating SEO config:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return error(MESSAGES.VALIDATION_ERROR);
    }

    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Get all SEO configurations
 */
export async function getAllSEOConfigs(
  page: number = 1,
  limit: number = 10
) {
  try {
    await connectDB();

    // Calculate total count for pagination
    const total = await SEOConfig.countDocuments();

    // Get SEO configurations with pagination
    const seoConfigs = await SEOConfig.find({})
      .sort({ lastUpdated: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return success({
      seoConfigs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, MESSAGES.SEO_CONFIGS_FETCHED);
  } catch (err: any) {
    console.error('Error fetching SEO configs:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * Delete SEO configuration for a specific page
 */
export async function deleteSEOConfig(pageUrl: string) {
  try {
    await connectDB();

    const deletedConfig = await SEOConfig.findOneAndDelete({ pageUrl });

    if (!deletedConfig) {
      return error(MESSAGES.SEO_CONFIG_NOT_FOUND);
    }

    return success(null, MESSAGES.SEO_CONFIG_DELETED);
  } catch (err: any) {
    console.error('Error deleting SEO config:', err);
    return error(MESSAGES.INTERNAL_ERROR);
  }
}