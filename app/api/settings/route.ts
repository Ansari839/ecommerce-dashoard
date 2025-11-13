import { NextRequest, NextResponse } from 'next/server';
import { getAllSettings, updateSettings, getAuditLogs } from '@/controllers/settingsController';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || undefined;

    if (section === 'audit-logs') {
      const result = await getAuditLogs();
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      return NextResponse.json(result, { status: 200 });
    } else {
      const result = await getAllSettings();
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    console.error('Error in GET /api/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update settings
    const result = await updateSettings(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}