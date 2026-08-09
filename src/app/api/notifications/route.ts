import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function GET() {
  const notifications = ProjectService.getNotifications();
  return NextResponse.json({ success: true, data: notifications });
}
