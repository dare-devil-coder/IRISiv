import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId') || undefined;
  const logs = ProjectService.getAuditLogs(projectId);
  return NextResponse.json({ success: true, data: logs });
}
