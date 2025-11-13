import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe,
  ExternalLink
} from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  followers?: number;
}

interface SocialLinksProps {
  links?: SocialLink[]; // Optional: if not provided, will show placeholder links
}

const defaultLinks: SocialLink[] = [
  { platform: 'Facebook', url: 'https://facebook.com/example', followers: 12500 },
  { platform: 'Instagram', url: 'https://instagram.com/example', followers: 8500 },
  { platform: 'Twitter', url: 'https://twitter.com/example', followers: 5200 },
  { platform: 'LinkedIn', url: 'https://linkedin.com/company/example', followers: 3800 },
  { platform: 'YouTube', url: 'https://youtube.com/example', followers: 15000 },
  { platform: 'TikTok', url: 'https://tiktok.com/@example', followers: 9700 },
];

export function SocialLinks({ links = defaultLinks }: SocialLinksProps) {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'tiktok':
        // Using external link for TikTok since it's not available in lucide-react
        return <ExternalLink className="h-5 w-5" />;
      case 'website':
        return <Globe className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600';
      case 'twitter':
        return 'bg-blue-400 hover:bg-blue-500';
      case 'linkedin':
        return 'bg-blue-700 hover:bg-blue-800';
      case 'youtube':
        return 'bg-red-600 hover:bg-red-700';
      case 'tiktok':
        return 'bg-black hover:bg-gray-800';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {links.map((link, index) => (
        <a 
          key={index} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <Button 
            variant="outline" 
            className={`w-full flex flex-col items-center p-4 ${getPlatformColor(link.platform)} text-white hover:text-white`}
          >
            <div className="flex items-center justify-center mb-2">
              {getIcon(link.platform)}
            </div>
            <div className="text-sm font-medium">{link.platform}</div>
            {link.followers && (
              <div className="text-xs mt-1 opacity-80">
                {link.followers >= 1000 
                  ? `${(link.followers / 1000).toFixed(1)}k followers` 
                  : `${link.followers} followers`}
              </div>
            )}
          </Button>
        </a>
      ))}
    </div>
  );
}