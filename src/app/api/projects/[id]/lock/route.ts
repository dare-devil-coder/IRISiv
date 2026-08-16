import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const corpOrgId = body.corporate_organization_id || 'org-corp-1';

    const project = await ProjectService.lockProject(id, corpOrgId);
    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to lock project' } },
      { status: 500 }
    );
  }
}
