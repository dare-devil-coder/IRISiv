import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await ProjectService.startProjectWork(id);
    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'PROJECT_START_FAILED', message: error.message } },
      { status: 400 }
    );
  }
}
