import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST() {
  const res = ProjectService.resetDemoState();
  return NextResponse.json(res);
}
