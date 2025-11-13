import { NextRequest, NextResponse } from 'next/server';
import {
  getSEOConfig,
  updateSEOConfig,
  getAllSEOConfigs,
  deleteSEOConfig
} from '@/controllers/seoController';
import { revalidatePath } from 'next/cache';
import { checkPermissionMiddleware } from '@/middleware/checkPermission';

export async function GET(request: NextRequest) {
  try {
    // Check permission for viewing SEO configs
    const permissionCheck = await checkPermissionMiddleware(request, 'seo', 'view');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const pageUrl = searchParams.get('pageUrl');

    if (pageUrl) {
      // Get specific SEO config
      const result = await getSEOConfig(pageUrl);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json(result, { status: 200 });
    } else {
      // Get all SEO configs
      const result = await getAllSEOConfigs(page, limit);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    console.error('Error in GET /api/seo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check permission for updating SEO configs
    const permissionCheck = await checkPermissionMiddleware(request, 'seo', 'update');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['pageUrl', 'title', 'description'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const result = await updateSEOConfig(body.pageUrl, {
      title: body.title,
      description: body.description,
      keywords: body.keywords,
      ogTitle: body.ogTitle,
      ogDescription: body.ogDescription,
      ogImage: body.ogImage,
      twitterTitle: body.twitterTitle,
      twitterDescription: body.twitterDescription,
      twitterImage: body.twitterImage,
      canonicalUrl: body.canonicalUrl,
      robots: body.robots
    });

    if (!result.success) {
      const status = result.error === 'Validation failed' ? 400 : 500;
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Revalidate the marketing and reports pages to reflect changes
    revalidatePath('/dashboard/marketing');
    revalidatePath('/dashboard/reports');

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/seo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check permission for deleting SEO configs
    const permissionCheck = await checkPermissionMiddleware(request, 'seo', 'delete');
    
    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body.pageUrl) {
      return NextResponse.json(
        { error: 'pageUrl is required' },
        { status: 400 }
      );
    }

    const result = await deleteSEOConfig(body.pageUrl);

    if (!result.success) {
      const status = result.error === 'SEO configuration not found' ? 404 : 500;
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
    console.error('Error in DELETE /api/seo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}