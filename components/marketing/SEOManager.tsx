'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface SEOConfig {
  pageUrl: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  robots: string;
}

interface SEOManagerProps {
  pageUrl?: string; // Optional: if not provided, user can enter any URL
}

export function SEOManager({ pageUrl }: SEOManagerProps) {
  const [seoData, setSeoData] = useState<SEOConfig>({
    pageUrl: pageUrl || '',
    title: '',
    description: '',
    keywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    robots: 'index, follow'
  });
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Load SEO config if a pageUrl is provided
  useEffect(() => {
    if (pageUrl) {
      fetchSEOConfig(pageUrl);
    }
  }, [pageUrl]);

  const fetchSEOConfig = async (url: string) => {
    try {
      // In a real app, fetch from your API
      // const response = await fetch(`/api/seo?pageUrl=${encodeURIComponent(url)}`);
      // const data = await response.json();
      // setSeoData(data.data);
    } catch (error) {
      console.error('Error fetching SEO config:', error);
    }
  };

  const handleInputChange = (field: keyof SEOConfig, value: string | string[]) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !seoData.keywords.includes(currentKeyword.trim())) {
      handleInputChange('keywords', [...seoData.keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = [...seoData.keywords];
    newKeywords.splice(index, 1);
    handleInputChange('keywords', newKeywords);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!seoData.pageUrl) {
      newErrors.pageUrl = 'Page URL is required';
    }
    
    if (!seoData.title) {
      newErrors.title = 'Title is required';
    } else if (seoData.title.length > 60) {
      newErrors.title = 'Title should be under 60 characters';
    }
    
    if (!seoData.description) {
      newErrors.description = 'Description is required';
    } else if (seoData.description.length > 160) {
      newErrors.description = 'Description should be under 160 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // In a real app, send to your API
      // const response = await fetch('/api/seo', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(seoData)
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving SEO config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>SEO Configuration</CardTitle>
            <CardDescription>Optimize your page for search engines and social media</CardDescription>
          </div>
          {isSaved && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Saved</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="pageUrl">Page URL</Label>
            <Input
              id="pageUrl"
              value={seoData.pageUrl}
              onChange={(e) => handleInputChange('pageUrl', e.target.value)}
              placeholder="e.g., /products/summer-sale"
              disabled={!!pageUrl}
            />
            {errors.pageUrl && <p className="text-sm text-red-500 mt-1">{errors.pageUrl}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={seoData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Page title for search results"
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                {seoData.title.length}/60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                value={seoData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the page content"
                rows={3}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                {seoData.description.length}/160 characters
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="keywords"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                placeholder="Add a keyword and press Enter or click +"
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button type="button" variant="outline" onClick={addKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {seoData.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center">
                  {keyword}
                  <button 
                    type="button" 
                    onClick={() => removeKeyword(index)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ogTitle">Open Graph Title</Label>
              <Input
                id="ogTitle"
                value={seoData.ogTitle}
                onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                placeholder="Title for social media shares"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {seoData.ogTitle.length}/60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="ogDescription">Open Graph Description</Label>
              <Textarea
                id="ogDescription"
                value={seoData.ogDescription}
                onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                placeholder="Description for social media shares"
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {seoData.ogDescription.length}/160 characters
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="ogImage">Open Graph Image URL</Label>
            <Input
              id="ogImage"
              value={seoData.ogImage}
              onChange={(e) => handleInputChange('ogImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="twitterTitle">Twitter Title</Label>
              <Input
                id="twitterTitle"
                value={seoData.twitterTitle}
                onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                placeholder="Title for Twitter cards"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {seoData.twitterTitle.length}/60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="twitterDescription">Twitter Description</Label>
              <Textarea
                id="twitterDescription"
                value={seoData.twitterDescription}
                onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                placeholder="Description for Twitter cards"
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {seoData.twitterDescription.length}/160 characters
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="twitterImage">Twitter Image URL</Label>
            <Input
              id="twitterImage"
              value={seoData.twitterImage}
              onChange={(e) => handleInputChange('twitterImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={seoData.canonicalUrl}
                onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>

            <div>
              <Label htmlFor="robots">Robots Meta Tag</Label>
              <select
                id="robots"
                value={seoData.robots}
                onChange={(e) => handleInputChange('robots', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center"
            >
              {isSaving ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save SEO Configuration
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}