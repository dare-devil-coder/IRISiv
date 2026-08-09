import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quotations = ProjectService.getQuotationsByTender(id);
    return NextResponse.json({ success: true, data: quotations });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { business_organization_id, ...quotationData } = body;
    if (!business_organization_id) {
      return NextResponse.json({ success: false, error: { message: 'business_organization_id is required' } }, { status: 400 });
    }
    const quotation = await ProjectService.submitQuotation(id, business_organization_id, quotationData);
    return NextResponse.json({ success: true, data: quotation }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = message.includes('already submitted') || message.includes('not open') ? 400 : 500;
    return NextResponse.json({ success: false, error: { message } }, { status: statusCode });
  }
}
