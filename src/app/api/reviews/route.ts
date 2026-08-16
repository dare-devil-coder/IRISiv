import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';
import { UserRole } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId') || undefined;
    const role = (searchParams.get('role') as UserRole) || undefined;
    const projectId = searchParams.get('projectId') || undefined;

    const reviews = ProjectService.getReviews({ orgId, role, projectId });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch reviews' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projectId = body.projectId || body.project_id;
    const reviewerOrgId = body.reviewerOrgId || body.reviewer_org_id;
    const reviewerRole = body.reviewerRole || body.reviewer_role;
    const targetOrgId = body.targetOrgId || body.target_org_id;
    const targetRole = body.targetRole || body.target_role;
    const rating = Number(body.rating);
    const comment = body.comment;

    if (!projectId || !reviewerOrgId || !targetOrgId || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: { message: 'Missing required review fields (projectId, reviewerOrgId, targetOrgId, rating, comment)' } },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: { message: 'Rating must be an integer between 1 and 5' } },
        { status: 422 }
      );
    }

    if (reviewerOrgId === targetOrgId) {
      return NextResponse.json(
        { success: false, error: { message: 'Cannot review your own organization' } },
        { status: 400 }
      );
    }

    const review = ProjectService.createReview({
      projectId,
      reviewerOrgId,
      reviewerRole: reviewerRole || 'NGO',
      targetOrgId,
      targetRole: targetRole || 'CORPORATE',
      rating,
      comment,
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to submit review' } },
      { status: 500 }
    );
  }
}
