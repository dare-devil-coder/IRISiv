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
    const { projectId, reviewerOrgId, reviewerRole, targetOrgId, targetRole, rating, comment } = body;

    if (!projectId || !reviewerOrgId || !targetOrgId || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: { message: 'Missing required review fields' } },
        { status: 400 }
      );
    }

    const review = ProjectService.createReview({
      projectId,
      reviewerOrgId,
      reviewerRole,
      targetOrgId,
      targetRole,
      rating: Number(rating),
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
