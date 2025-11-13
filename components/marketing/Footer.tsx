import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MarketingPlatform</h3>
            <p className="text-muted-foreground">
              All-in-one marketing platform to grow your business with powerful analytics and campaign management.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">SOLUTIONS</h3>
            <ul className="space-y-2">
              <li><Link href="/campaigns" className="text-muted-foreground hover:text-foreground text-sm">Campaign Management</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Social Media Ads</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">SEO Optimization</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">SUPPORT</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm">Contact</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">API Documentation</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Status</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground text-sm">About</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Press</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} MarketingPlatform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}