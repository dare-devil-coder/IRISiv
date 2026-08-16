import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await ProjectService.getProjectById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      );
    }

    const delivery = ProjectService.getDelivery(project.id);
    const ngoVerification = ProjectService.getNGOVerification(project.id);
    const aiVerification = ProjectService.getAIVerification(project.id);
    const payments = ProjectService.getPayments(project.id);
    const proposals = await ProjectService.getProposalsByProject(project.id);
    const impactReport = ProjectService.getImpactReport(project.id);

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        project,
        delivery,
        ngoVerification,
        aiVerification,
        payments,
        proposals,
        impactReport,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'PROJECT_FETCH_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
