'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart3, Users, ShoppingBag, Globe } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: 'SEO Optimization',
      description: 'Improve your search rankings with our advanced SEO tools',
      icon: <Globe className="h-8 w-8 text-blue-500" />
    },
    {
      title: 'Social Media Ads',
      description: 'Run targeted campaigns across major social platforms',
      icon: <Users className="h-8 w-8 text-green-500" />
    },
    {
      title: 'Analytics Tracking',
      description: 'Monitor performance and ROI in real-time',
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />
    },
    {
      title: 'E-commerce Integration',
      description: 'Seamlessly connect with your online store',
      icon: <ShoppingBag className="h-8 w-8 text-orange-500" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Grow Your Business with <span className="text-blue-600">Smart Marketing</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Our all-in-one marketing platform helps you reach your target audience, track performance, and maximize ROI across all channels.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            Schedule Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Marketing Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to grow your business and reach your marketing goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Ready to grow your business?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of businesses using our marketing platform to achieve their goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}