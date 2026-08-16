import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';
import { requireRole } from '@/lib/middleware/auth';
import { Logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(request, ['ADMIN']);
    const { id } = await params;
    const org = ProjectService.approveKYC(id);
    Logger.info('Admin approved KYC', { orgId: id });
    return NextResponse.json({ success: true, data: org });
  } catch (error: any) {
    Logger.error('Failed to approve KYC', undefined, error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to approve KYC' } },
      { status: error.message?.includes('FORBIDDEN') ? 403 : 500 }
    );
  }
}
