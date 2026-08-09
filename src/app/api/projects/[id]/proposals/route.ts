import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proposals = await ProjectService.getProposalsByProject(id);
    return NextResponse.json({ success: true, data: proposals });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'PROPOSALS_FETCH_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const bizOrgId = body.business_organization_id || 'org-biz-1';

    const proposal = await ProjectService.submitProposal(id, bizOrgId, {
      bid_amount: body.bid_amount,
      delivery_timeline_days: body.delivery_timeline_days,
      capacity: body.capacity,
      experience: body.experience,
      description: body.description,
    });

    return NextResponse.json({ success: true, data: proposal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'PROPOSAL_SUBMIT_FAILED', message: error.message } },
      { status: 400 }
    );
  }
}
