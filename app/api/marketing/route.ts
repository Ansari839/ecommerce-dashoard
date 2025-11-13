import { NextRequest, NextResponse } from 'next/server';
import {
  getCampaigns,
  createCampaign
} from '@/controllers/marketingController';
import { revalidatePath } from 'next/cache';
import { authorize } from '@/helpers/authorize';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    const result = await getCampaigns(page, limit, search);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/marketing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization - only Admin, Marketing, or Finance roles can create campaigns
    const allowedRoles = ['Admin', 'Marketing', 'Finance'];
    const authResult = authorize(request, allowedRoles);

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['campaignName', 'platform', 'startDate', 'endDate', 'budget'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate numeric fields
    if (typeof body.budget !== 'number' || body.budget < 0) {
      return NextResponse.json(
        { error: 'Budget must be a non-negative number' },
        { status: 400 }
      );
    }

    if (typeof body.spent !== 'number' || body.spent < 0) {
      return NextResponse.json(
        { error: 'Spent amount must be a non-negative number' },
        { status: 400 }
      );
    }

    if (typeof body.impressions !== 'number' || body.impressions < 0) {
      return NextResponse.json(
        { error: 'Impressions must be a non-negative number' },
        { status: 400 }
      );
    }

    if (typeof body.clicks !== 'number' || body.clicks < 0) {
      return NextResponse.json(
        { error: 'Clicks must be a non-negative number' },
        { status: 400 }
      );
    }

    if (typeof body.conversions !== 'number' || body.conversions < 0) {
      return NextResponse.json(
        { error: 'Conversions must be a non-negative number' },
        { status: 400 }
      );
    }

    // Validate date fields
    if (isNaN(Date.parse(body.startDate)) || isNaN(Date.parse(body.endDate))) {
      return NextResponse.json(
        { error: 'Start date and end date must be valid dates' },
        { status: 400 }
      );
    }

    const result = await createCampaign({
      platform: body.platform,
      campaignName: body.campaignName,
      budget: body.budget,
      spent: body.spent || 0,
      impressions: body.impressions || 0,
      clicks: body.clicks || 0,
      conversions: body.conversions || 0,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: body.status || 'draft'
    });

    if (!result.success) {
      const status = result.error === 'Validation failed' ? 400 : 500;
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the marketing and reports pages to reflect changes
    revalidatePath('/dashboard/marketing');
    revalidatePath('/dashboard/reports');

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/marketing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}