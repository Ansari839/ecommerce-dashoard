import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllFlashSales,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
  getAllEmailCampaigns,
  createEmailCampaign,
  updateEmailCampaign,
  deleteEmailCampaign
} from '@/controllers/marketingController';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource type is required (coupons, flash-sales, email-campaigns)' },
        { status: 400 }
      );
    }

    let result;

    switch (resource) {
      case 'coupons':
        result = await getAllCoupons(status, search);
        break;
      case 'flash-sales':
        result = await getAllFlashSales(status, search);
        break;
      case 'email-campaigns':
        result = await getAllEmailCampaigns(status, search);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid resource type' },
          { status: 400 }
        );
    }

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
    const body = await request.json();
    const { resource } = body;

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource type is required (coupons, flash-sales, email-campaigns)' },
        { status: 400 }
      );
    }

    let result;

    switch (resource) {
      case 'coupons':
        result = await createCoupon(body.data);
        break;
      case 'flash-sales':
        result = await createFlashSale(body.data);
        break;
      case 'email-campaigns':
        result = await createEmailCampaign(body.data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid resource type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/marketing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { resource, id } = body;

    if (!resource || !id) {
      return NextResponse.json(
        { error: 'Resource type and ID are required' },
        { status: 400 }
      );
    }

    let result;

    switch (resource) {
      case 'coupons':
        result = await updateCoupon(id, body.data);
        break;
      case 'flash-sales':
        result = await updateFlashSale(id, body.data);
        break;
      case 'email-campaigns':
        result = await updateEmailCampaign(id, body.data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid resource type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/marketing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource') || undefined;
    const id = searchParams.get('id') || undefined;

    if (!resource || !id) {
      return NextResponse.json(
        { error: 'Resource type and ID are required' },
        { status: 400 }
      );
    }

    let result;

    switch (resource) {
      case 'coupons':
        result = await deleteCoupon(id);
        break;
      case 'flash-sales':
        result = await deleteFlashSale(id);
        break;
      case 'email-campaigns':
        result = await deleteEmailCampaign(id);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid resource type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/marketing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}