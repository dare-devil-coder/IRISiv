import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payment = await ProjectService.recordAdvancePayment(id);
    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = message.includes('Cannot') ? 400 : 500;
    return NextResponse.json({ success: false, error: { message } }, { status: statusCode });
  }
}
