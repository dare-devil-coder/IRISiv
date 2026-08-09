import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

// GET /api/tenders — list all tenders (optionally filter by status)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const tenders = ProjectService.getTenders(status);
    return NextResponse.json({ success: true, data: tenders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}

// POST /api/tenders — create a new tender for a project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, corporate_organization_id, ...tenderData } = body;

    if (!project_id || !corporate_organization_id) {
      return NextResponse.json({ success: false, error: { message: 'project_id and corporate_organization_id are required' } }, { status: 400 });
    }

    const tender = await ProjectService.createTender(project_id, corporate_organization_id, tenderData);
    return NextResponse.json({ success: true, data: tender }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
