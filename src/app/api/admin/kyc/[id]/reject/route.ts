import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';
import { requireRole } from '@/lib/middleware/auth';
import { Logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(request, ['ADMIN']);
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'Documentation did not meet verification criteria';
    const org = ProjectService.rejectKYC(id, reason);
    Logger.info('Admin rejected KYC', { orgId: id, reason });
    return NextResponse.json({ success: true, data: org });
  } catch (error: any) {
    Logger.error('Failed to reject KYC', undefined, error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to reject KYC' } },
      { status: error.message?.includes('FORBIDDEN') ? 403 : 500 }
    );
  }
}
