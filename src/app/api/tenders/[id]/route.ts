import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tender = ProjectService.getTenderById(id);
    if (!tender) return NextResponse.json({ success: false, error: { message: 'Tender not found' } }, { status: 404 });
    return NextResponse.json({ success: true, data: tender });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
