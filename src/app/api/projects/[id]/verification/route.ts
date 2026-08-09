import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await ProjectService.submitNGOVerification(id, body.delivery_id, {
      quantity_received: body.quantity_received,
      quality_acceptable: body.quality_acceptable,
      packaging_acceptable: body.packaging_acceptable,
      delivered_on_time: body.delivered_on_time,
      invoice_reference: body.invoice_reference,
      comments: body.comments,
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'VERIFICATION_SUBMIT_FAILED', message: error.message } },
      { status: 400 }
    );
  }
}
