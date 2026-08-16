import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';
import { getAuthenticatedUser } from '@/lib/middleware/auth';
import { validateRequestBody, handleValidationError } from '@/lib/middleware/validation';
import { CreateProjectSchema } from '@/lib/validators/schemas';
import { Logger } from '@/lib/utils/logger';
import { UserRole } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') as UserRole | null;
    const orgId = searchParams.get('orgId') || undefined;

    const projects = await ProjectService.getProjects(role || undefined, orgId);
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    Logger.error('Failed to fetch projects', undefined, error);
    return NextResponse.json(
      { success: false, error: { code: 'PROJECT_FETCH_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const validatedData = await validateRequestBody(request, CreateProjectSchema);

    const ngoOrgId = validatedData.ngo_organization_id || user.organizationId || 'org-ngo-1';

    const project = await ProjectService.createRequirement(ngoOrgId, {
      title: validatedData.title,
      category: validatedData.category,
      fulfillment_type: 'PRODUCT',
      location: validatedData.location,
      description: validatedData.description,
      beneficiaries: Number(validatedData.beneficiaries || validatedData.beneficiaries_impacted || validatedData.target_quantity || 100),
      estimated_budget: Number(validatedData.estimated_budget),
      deadline: validatedData.deadline,
      submitImmediately: true,
    });

    try {
      await ProjectService.analyzeNGONeed(project.id);
    } catch (err) {
      Logger.warn('Immediate AI need analysis warning', { projectId: project.id }, err);
    }

    Logger.info('Project requirement created', { projectId: project.id, ngoOrgId });
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    const validationRes = handleValidationError(error);
    if (validationRes) return validationRes;

    Logger.error('Failed to create project', undefined, error);
    return NextResponse.json(
      { success: false, error: { code: 'PROJECT_CREATE_FAILED', message: error.message || 'Failed to create requirement' } },
      { status: error.status || 500 }
    );
  }
}
