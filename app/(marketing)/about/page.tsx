import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Our Marketing Platform</h1>
        <p className="text-xl text-gray-600">
          Connecting businesses with their customers through innovative marketing solutions
        </p>
      </div>

      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              At our core, we believe that effective marketing should be data-driven, accessible, and deliver real results. 
              Our platform empowers businesses of all sizes to create, manage, and optimize their marketing campaigns 
              across multiple channels from a single dashboard.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To become the definitive marketing platform that helps businesses grow by providing 
                actionable insights, automation tools, and seamless integration with the digital 
                marketing ecosystem.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Data-driven decision making</li>
                <li>Customer-centric approach</li>
                <li>Innovation and continuous improvement</li>
                <li>Transparency and trust</li>
                <li>Accessibility for all business sizes</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">All-in-One Platform</h3>
                <p className="text-gray-600">Manage all your marketing efforts from a single dashboard</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">ROI Focused</h3>
                <p className="text-gray-600">Track and optimize for the metrics that matter to your business</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
                <p className="text-gray-600">Get guidance from our team of marketing specialists</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}