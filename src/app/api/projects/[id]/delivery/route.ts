import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { business_organization_id = 'org-biz-1', ...fulfillmentData } = body;
    const fulfillment = await ProjectService.submitFulfillment(id, business_organization_id, fulfillmentData);
    return NextResponse.json({ success: true, data: fulfillment }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = message.includes('Cannot') || message.includes('not found') ? 400 : 500;
    return NextResponse.json({ success: false, error: { message } }, { status: statusCode });
  }
}
