import { NextRequest, NextResponse } from 'next/server';
import {
  generateProfitLoss,
  getProfitLoss,
  getCategoryWisePL
} from '@/controllers/plController';
import { revalidatePath } from 'next/cache';
import { authorize } from '@/helpers/authorize';

export async function GET(request: NextRequest) {
  try {
    // Check authorization - only Admin or Finance roles can access P&L reports
    const allowedRoles = ['Admin', 'Finance'];
    const authResult = authorize(request, allowedRoles);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 403 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || undefined;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
    const categoryWise = searchParams.get('categoryWise') === 'true';

    if (categoryWise) {
      const result = await getCategoryWisePL(period, startDate, endDate);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      return NextResponse.json(result, { status: 200 });
    } else {
      const result = await getProfitLoss(period, startDate, endDate);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    console.error('Error in GET /api/pl:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization - only Admin or Finance roles can generate P&L reports
    const allowedRoles = ['Admin', 'Finance'];
    const authResult = authorize(request, allowedRoles);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const period = body.period || 'monthly';
    const startDate = body.startDate ? new Date(body.startDate) : undefined;
    const endDate = body.endDate ? new Date(body.endDate) : undefined;

    const result = await generateProfitLoss(period, startDate, endDate);

    if (!result.success) {
      const status = result.error === 'Validation failed' ? 400 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the reports and P&L summary pages to reflect changes
    revalidatePath('/dashboard/reports');
    revalidatePath('/dashboard/pl-summary');

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/pl:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}