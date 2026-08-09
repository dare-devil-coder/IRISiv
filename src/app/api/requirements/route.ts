import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ngoOrgId = body.ngo_organization_id || 'org-ngo-1';

    const project = await ProjectService.createRequirement(ngoOrgId, {
      title: body.title,
      category: body.category,
      fulfillment_type: body.fulfillment_type,
      location: body.location,
      description: body.description,
      beneficiaries: Number(body.beneficiaries),
      estimated_budget: Number(body.estimated_budget),
      deadline: body.deadline,
      urgency: body.urgency,
      submitImmediately: body.submitImmediately ?? true,
    });

    if (body.submitImmediately) {
      try {
        await ProjectService.analyzeNGONeed(project.id);
      } catch (err) {
        console.warn('Immediate AI need analysis failed:', err);
      }
    }

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'REQUIREMENT_CREATE_FAILED', message: error.message || 'Failed to create requirement' } },
      { status: 500 }
    );
  }
}
