import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';
import { requireRole } from '@/lib/middleware/auth';
import { Logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(request, ['CORPORATE']);
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const idempotencyKey = body.idempotency_key || body.idempotencyKey;
    const payment = await ProjectService.payFinalPayment(id, undefined, idempotencyKey);
    Logger.info('Recorded final 40% payment and completed project', { projectId: id, amount: payment.amount, idempotencyKey });
    return NextResponse.json({ success: true, data: payment });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    Logger.error('Failed to record final payment', undefined, error);
    const statusCode = message.includes('Cannot') || message.includes('FORBIDDEN') ? 400 : 500;
    return NextResponse.json({ success: false, error: { message } }, { status: statusCode });
  }
}
