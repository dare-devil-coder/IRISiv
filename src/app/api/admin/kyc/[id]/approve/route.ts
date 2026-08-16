import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const org = ProjectService.approveKYC(id);
    return NextResponse.json({ success: true, data: org });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to approve KYC' } },
      { status: 500 }
    );
  }
}
