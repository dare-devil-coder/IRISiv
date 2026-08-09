import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const analysis = ProjectService.getNeedAnalysis(id);
    return NextResponse.json({ success: true, data: analysis || null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const analysis = await ProjectService.analyzeNGONeed(id);
    return NextResponse.json({ success: true, data: analysis }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
