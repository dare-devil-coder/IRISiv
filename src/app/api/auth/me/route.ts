import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/middleware/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization_id: user.organizationId,
          organizationName: user.organizationName,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: error.message || 'Authentication required' } },
      { status: 401 }
    );
  }
}
