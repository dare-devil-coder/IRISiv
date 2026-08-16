import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'NGO', organizationName, location, domain, registrationNumber, panNumber } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, email, and password required' } },
        { status: 422 }
      );
    }

    const org = ProjectService.createOrganization({
      name: organizationName || `${name}'s Organization`,
      type: role,
      location: location || 'India',
      domain: domain || 'General',
      registration_number: registrationNumber || 'REG-PENDING',
      pan_number: panNumber || 'PAN-PENDING',
      kyc_status: 'KYC_PENDING',
      verification_status: 'DOCUMENTS_SUBMITTED',
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: `user-${Date.now()}`,
            name,
            email,
            role,
            organization_id: org.id,
            organizationName: org.name,
            kyc_status: org.kyc_status,
          },
          organization: org,
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
