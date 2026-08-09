import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quotation_id, corporate_organization_id } = body;
    if (!quotation_id) return NextResponse.json({ success: false, error: { message: 'quotation_id is required' } }, { status: 400 });
    const project = await ProjectService.selectQuotation(quotation_id, corporate_organization_id || 'org-corp-1');
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
