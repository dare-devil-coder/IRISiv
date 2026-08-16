import { NextResponse } from 'next/server';
import { DEMO_CREDENTIALS, DEMO_ORGS } from '@/lib/constants/demo';
import { createToken, AuthenticatedUser } from '@/lib/middleware/auth';
import { UserRole } from '@/types';
import { Logger } from '@/lib/utils/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email and password required' } },
        { status: 400 }
      );
    }

    // Match demo credentials
    const cred = DEMO_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() || (role && c.role === role.toUpperCase())
    );

    const userRole: UserRole = cred?.role || (role as UserRole) || 'NGO';
    const authenticatedUser: AuthenticatedUser = {
      id: cred?.profileId || `prof-${userRole.toLowerCase()}-1`,
      email,
      name: cred?.name || email.split('@')[0],
      role: userRole,
      organizationId: (cred as any)?.organizationId || (DEMO_ORGS as any)[userRole],
      organizationName: (cred as any)?.organizationName,
    };

    const token = createToken(authenticatedUser);

    Logger.info('User login successful', { userId: authenticatedUser.id, role: userRole });

    return NextResponse.json({
      success: true,
      data: {
        user: authenticatedUser,
        token,
        session: {
          access_token: token,
          token_type: 'bearer',
          expires_in: 604800, // 7 days
        },
      },
    });
  } catch (error: any) {
    Logger.error('Auth login failed', undefined, error);
    return NextResponse.json(
      { success: false, error: { code: 'AUTH_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
