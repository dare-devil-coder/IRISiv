// Demo organization IDs and profile mappings for IRISiv development & testing
export const DEMO_ORGS = {
  NGO: 'org-ngo-1',
  CORPORATE: 'org-corp-1',
  BUSINESS: 'org-biz-1',
} as const;

export const DEMO_PROFILES = {
  ADMIN: 'prof-admin-1',
  NGO_REP: 'prof-ngo-1',
  CORPORATE_REP: 'prof-corp-1',
  BUSINESS_REP: 'prof-biz-1',
} as const;

export const DEMO_ORGANIZATIONS = [
  {
    id: 'org-ngo-1',
    name: 'Shiksha Foundation',
    type: 'NGO',
    registration_number: 'CSR-IN-88912',
    location: 'New Delhi, Delhi',
    kyc_status: 'KYC_APPROVED',
    trust_score: 96,
  },
  {
    id: 'org-corp-1',
    name: 'Apex Global Technologies',
    type: 'CORPORATE',
    registration_number: 'CIN-U72200KA2015PTC',
    location: 'Bengaluru, Karnataka',
    kyc_status: 'KYC_APPROVED',
    trust_score: 98,
  },
  {
    id: 'org-biz-1',
    name: 'GreenGrow Agro & Education Supplies',
    type: 'BUSINESS',
    registration_number: 'GSTIN-27AAAAA0000A1Z5',
    location: 'Pune, Maharashtra',
    kyc_status: 'KYC_APPROVED',
    trust_score: 94,
  },
] as const;

export const DEMO_CREDENTIALS = [
  {
    email: 'admin@irisiv.org',
    password: 'admin',
    role: 'ADMIN',
    profileId: 'prof-admin-1',
    name: 'IRISiv Compliance Admin',
  },
  {
    email: 'ananya@shikshafoundation.org',
    password: 'ngo',
    role: 'NGO',
    profileId: 'prof-ngo-1',
    organizationId: 'org-ngo-1',
    organizationName: 'Shiksha Foundation',
    name: 'Ananya Sharma',
  },
  {
    email: 'rahul@apextech.com',
    password: 'corp',
    role: 'CORPORATE',
    profileId: 'prof-corp-1',
    organizationId: 'org-corp-1',
    organizationName: 'Apex Technologies CSR',
    name: 'Rahul Mehta',
  },
  {
    email: 'vikram@greengrow.in',
    password: 'biz',
    role: 'BUSINESS',
    profileId: 'prof-biz-1',
    organizationId: 'org-biz-1',
    organizationName: 'GreenGrow Agro Supplies',
    name: 'Vikram Patel',
  },
] as const;
