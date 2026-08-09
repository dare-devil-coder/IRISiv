import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: 'prof-corp-1',
        name: 'Rajesh Verma',
        email: 'rajesh.verma@apextech.com',
        role: 'CORPORATE',
        organization: 'Apex Global Technologies',
      },
    },
  });
}
