import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';
import { FeatherlessAIAdapter } from '@/lib/ai/featherlessAdapter';
import { UserRole } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role: UserRole = body.role || 'CORPORATE';
    const query: string = body.query || '';

    const projects = await ProjectService.getProjects(role);
    const responseText = await FeatherlessAIAdapter.answerAssistantQuery(role, projects, query);

    return NextResponse.json({ success: true, data: { response: responseText } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'AI_ASSISTANT_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
