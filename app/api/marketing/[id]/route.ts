import { NextRequest, NextResponse } from 'next/server';
import {
  getCampaignById,
  updateCampaign,
  deleteCampaign
} from '@/controllers/marketingController';
import { revalidatePath } from 'next/cache';
import { authorize } from '@/helpers/authorize';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the id from params
    const { id } = params;

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
    console.error('Error in GET /api/marketing/[id]:', error);
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
    // Check authorization - only Admin, Marketing, or Finance roles can update campaigns
    const allowedRoles = ['Admin', 'Marketing', 'Finance'];
    const authResult = authorize(request, allowedRoles);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
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
        { error: result.error, details: result.details },
        { status }
      );
    }

    // Revalidate the marketing and reports pages to reflect changes
    revalidatePath('/dashboard/marketing');
    revalidatePath('/dashboard/reports');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/marketing/[id]:', error);
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
    // Check authorization - only Admin, Marketing, or Finance roles can delete campaigns
    const allowedRoles = ['Admin', 'Marketing', 'Finance'];
    const authResult = authorize(request, allowedRoles);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
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
    console.error('Error in DELETE /api/marketing/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}