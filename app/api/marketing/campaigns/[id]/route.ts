import { NextRequest, NextResponse } from 'next/server';
import {
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  fetchAnalytics
} from '@/controllers/marketingController';
import { revalidatePath } from 'next/cache';
import { checkPermissionMiddleware } from '@/middleware/checkPermission';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check permission for viewing campaigns
    const permissionCheck = await checkPermissionMiddleware(request, 'marketing', 'view');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;
    
    // Check if we're fetching analytics
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'analytics') {
      const platform = searchParams.get('platform');
      if (!platform) {
        return NextResponse.json(
          { error: 'Platform is required for analytics' },
          { status: 400 }
        );
      }
      
      const result = await fetchAnalytics(id, platform);
      
      if (!result.success) {
        const status = result.error === 'Marketing campaign not found' ? 404 : 500;
        return NextResponse.json(
          { error: result.error },
          { status }
        );
      }
      
      return NextResponse.json(result, { status: 200 });
    }

    const result = await getCampaignById(id);

    if (!result.success) {
      const status = result.error === 'Marketing campaign not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/marketing/campaigns/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check permission for updating campaigns
    const permissionCheck = await checkPermissionMiddleware(request, 'marketing', 'update');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;
    const body = await request.json();

    const result = await updateCampaign(id, body);

    if (!result.success) {
      const status =
        result.error === 'Marketing campaign not found' || result.error === 'Invalid campaign ID'
          ? 404
          : result.error === 'Validation failed'
            ? 400
            : 500;

      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the marketing and reports pages to reflect changes
    revalidatePath('/dashboard/marketing');
    revalidatePath('/dashboard/reports');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/marketing/campaigns/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check permission for deleting campaigns
    const permissionCheck = await checkPermissionMiddleware(request, 'marketing', 'delete');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Extract the id from params
    const { id } = params;

    const result = await deleteCampaign(id);

    if (!result.success) {
      const status = result.error === 'Marketing campaign not found' || result.error === 'Invalid campaign ID' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the marketing and reports pages to reflect changes
    revalidatePath('/dashboard/marketing');
    revalidatePath('/dashboard/reports');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/marketing/campaigns/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}