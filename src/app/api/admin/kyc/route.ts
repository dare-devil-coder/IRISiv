import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';
import { AccountStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as AccountStatus) || undefined;
    const orgs = ProjectService.getOrganizations(status);
    return NextResponse.json({ success: true, data: orgs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch organizations' } },
      { status: 500 }
    );
  }
}
