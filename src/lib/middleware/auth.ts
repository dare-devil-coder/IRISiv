import { NextRequest } from 'next/server';
import { UserRole } from '@/types';
import { DEMO_CREDENTIALS, DEMO_PROFILES, DEMO_ORGS } from '@/lib/constants/demo';
import { ProjectService } from '@/lib/services/projectService';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

export function parseToken(token: string): AuthenticatedUser | null {
  if (!token) return null;

  // Check demo static tokens
  if (token.startsWith('token-demo-') || token.startsWith('demo-token-')) {
    const roleMatch = token.replace('token-demo-', '').replace('demo-token-', '').toUpperCase();
    const cred = DEMO_CREDENTIALS.find((c) => c.role === roleMatch) || DEMO_CREDENTIALS[0];
    return {
      id: cred.profileId,
      email: cred.email,
      name: cred.name,
      role: cred.role as UserRole,
      organizationId: (cred as any).organizationId,
      organizationName: (cred as any).organizationName,
    };
  }

  // Base64 encoded payload: base64(JSON({ id, email, role, organizationId, name }))
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && parsed.role) {
      return {
        id: parsed.id,
        email: parsed.email || 'user@irisiv.org',
        name: parsed.name || 'IRISiv User',
        role: parsed.role as UserRole,
        organizationId: parsed.organizationId,
        organizationName: parsed.organizationName,
      };
    }
  } catch {
    // Non-base64 token fallback
  }

  // Match registered profile by ID if token is a direct profile/user ID
  const orgs = ProjectService.getOrganizations();
  for (const org of orgs) {
    if (token.includes(org.id)) {
      return {
        id: `prof-${org.id}`,
        email: `contact@${org.name.toLowerCase().replace(/\s+/g, '')}.org`,
        name: org.name,
        role: (org.organization_type || org.type || 'NGO') as UserRole,
        organizationId: org.id,
        organizationName: org.name,
      };
    }
  }

  return null;
}

export function createToken(user: AuthenticatedUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    organizationName: user.organizationName,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function getAuthenticatedUser(request: Request | NextRequest): Promise<AuthenticatedUser> {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  const roleHeader = request.headers.get('x-user-role') as UserRole | null;
  const userHeader = request.headers.get('x-user-id');
  const orgHeader = request.headers.get('x-org-id');

  // 1. Direct Bearer token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const user = parseToken(token);
    if (user) return user;
  }

  // 2. Custom header session (e.g. Next.js internal calls or demo switches)
  if (roleHeader) {
    const cred = DEMO_CREDENTIALS.find((c) => c.role === roleHeader);
    return {
      id: userHeader || cred?.profileId || `prof-${roleHeader.toLowerCase()}-1`,
      email: cred?.email || `${roleHeader.toLowerCase()}@irisiv.org`,
      name: cred?.name || `${roleHeader} User`,
      role: roleHeader,
      organizationId: orgHeader || (cred as any)?.organizationId || (DEMO_ORGS as any)[roleHeader],
      organizationName: (cred as any)?.organizationName,
    };
  }

  // 3. Fallback for public demo requests: default to ADMIN role in local dev
  return {
    id: DEMO_PROFILES.ADMIN,
    email: 'admin@irisiv.org',
    name: 'IRISiv Administrator',
    role: 'ADMIN',
    organizationId: undefined,
  };
}

export async function requireRole(request: Request | NextRequest, requiredRoles: UserRole[]): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);
  if (!requiredRoles.includes(user.role) && user.role !== 'ADMIN') {
    throw new Error(`FORBIDDEN: Requires one of role(s) [${requiredRoles.join(', ')}]. Current role: ${user.role}`);
  }
  return user;
}

export function verifyOrgAccess(user: AuthenticatedUser, targetOrgId?: string): boolean {
  if (user.role === 'ADMIN') return true;
  if (!targetOrgId) return true;
  return user.organizationId === targetOrgId;
}
