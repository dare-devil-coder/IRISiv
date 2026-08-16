import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'Documentation did not meet verification criteria';
    const org = ProjectService.rejectKYC(id, reason);
    return NextResponse.json({ success: true, data: org });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to reject KYC' } },
      { status: 500 }
    );
  }
}
