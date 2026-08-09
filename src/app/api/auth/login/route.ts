import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role = 'CORPORATE' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email and password required' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: `user-${Date.now()}`,
          email,
          role,
          name: email.split('@')[0] || 'User',
        },
        session: {
          access_token: `token-${Date.now()}`,
          token_type: 'bearer',
          expires_in: 3600,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'AUTH_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
