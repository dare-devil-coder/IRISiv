import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'NGO', organizationName } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, email, and password required' } },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: `user-${Date.now()}`,
            name,
            email,
            role,
            organizationName: organizationName || `${name} Org`,
          },
          session: {
            access_token: `token-${Date.now()}`,
            token_type: 'bearer',
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SIGNUP_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
