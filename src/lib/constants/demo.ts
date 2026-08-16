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
