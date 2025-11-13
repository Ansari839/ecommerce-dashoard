import { ISEOConfig } from '@/models/SEOConfig';

/**
 * Generate SEO meta tags for a page
 * @param seoConfig - SEO configuration for the page
 * @returns Array of meta tag objects
 */
export function generateMetaTags(seoConfig: ISEOConfig): Array<{ name?: string; property?: string; content: string }> {
  const metaTags = [
    // Standard meta tags
    { name: 'title', content: seoConfig.title },
    { name: 'description', content: seoConfig.description },
    { name: 'keywords', content: seoConfig.keywords.join(', ') },
    { name: 'robots', content: seoConfig.robots },
    
    // Open Graph tags
    { property: 'og:title', content: seoConfig.ogTitle || seoConfig.title },
    { property: 'og:description', content: seoConfig.ogDescription || seoConfig.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: seoConfig.canonicalUrl || '' },
  ];

  // Add image if available
  if (seoConfig.ogImage) {
    metaTags.push({ property: 'og:image', content: seoConfig.ogImage });
  }

  // Twitter Card tags
  metaTags.push(
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoConfig.twitterTitle || seoConfig.title },
    { name: 'twitter:description', content: seoConfig.twitterDescription || seoConfig.description }
  );

  // Add Twitter image if available
  if (seoConfig.twitterImage) {
    metaTags.push({ name: 'twitter:image', content: seoConfig.twitterImage });
  }

  return metaTags;
}

/**
 * Validate SEO configuration
 * @param seoConfig - SEO configuration to validate
 * @returns Object with validation errors or null if valid
 */
export function validateSEOConfig(seoConfig: Partial<ISEOConfig>): { [key: string]: string } | null {
  const errors: { [key: string]: string } = {};

  // Validate title
  if (seoConfig.title && seoConfig.title.length > 60) {
    errors.title = 'Title should be under 60 characters';
  }

  // Validate description
  if (seoConfig.description && seoConfig.description.length > 160) {
    errors.description = 'Description should be under 160 characters';
  }

  // Validate keywords count
  if (seoConfig.keywords && seoConfig.keywords.length > 10) {
    errors.keywords = 'Limit keywords to 10 or fewer';
  }

  // Validate Open Graph title
  if (seoConfig.ogTitle && seoConfig.ogTitle.length > 60) {
    errors.ogTitle = 'Open Graph title should be under 60 characters';
  }

  // Validate Open Graph description
  if (seoConfig.ogDescription && seoConfig.ogDescription.length > 160) {
    errors.ogDescription = 'Open Graph description should be under 160 characters';
  }

  // Validate Twitter title
  if (seoConfig.twitterTitle && seoConfig.twitterTitle.length > 60) {
    errors.twitterTitle = 'Twitter title should be under 60 characters';
  }

  // Validate Twitter description
  if (seoConfig.twitterDescription && seoConfig.twitterDescription.length > 160) {
    errors.twitterDescription = 'Twitter description should be under 160 characters';
  }

  // Validate image URLs
  if (seoConfig.ogImage && !isValidImageUrl(seoConfig.ogImage)) {
    errors.ogImage = 'Please provide a valid Open Graph image URL';
  }

  if (seoConfig.twitterImage && !isValidImageUrl(seoConfig.twitterImage)) {
    errors.twitterImage = 'Please provide a valid Twitter image URL';
  }

  // Validate canonical URL
  if (seoConfig.canonicalUrl && !isValidUrl(seoConfig.canonicalUrl)) {
    errors.canonicalUrl = 'Please provide a valid canonical URL';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Check if a string is a valid URL
 * @param url - URL string to validate
 * @returns Boolean indicating if URL is valid
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is a valid image URL
 * @param url - Image URL string to validate
 * @returns Boolean indicating if image URL is valid
 */
function isValidImageUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const urlLower = url.toLowerCase();
  return validExtensions.some(ext => urlLower.includes(ext));
}