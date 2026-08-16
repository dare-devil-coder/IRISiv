'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { DEMO_CREDENTIALS } from '@/lib/constants/demo';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  role: UserRole;
  organizationId?: string;
  loginAs: (role: UserRole) => void;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage on mount
    try {
      const storedToken = localStorage.getItem('irisiv_token');
      const storedUser = localStorage.getItem('irisiv_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Default to NGO demo login
        loginAs('NGO');
      }
    } catch {
      // Fallback
    }
  }, []);

  const loginAs = (role: UserRole) => {
    const cred = DEMO_CREDENTIALS.find((c) => c.role === role) || DEMO_CREDENTIALS[0];
    const demoUser: AuthUser = {
      id: cred.profileId,
      email: cred.email,
      name: cred.name,
      role: cred.role as UserRole,
      organizationId: (cred as any).organizationId,
      organizationName: (cred as any).organizationName,
    };
    const demoToken = `token-demo-${role.toLowerCase()}`;
    setUser(demoUser);
    setToken(demoToken);
    try {
      localStorage.setItem('irisiv_token', demoToken);
      localStorage.setItem('irisiv_user', JSON.stringify(demoUser));
    } catch {}
  };

  const setAuth = (newUser: AuthUser, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    try {
      localStorage.setItem('irisiv_token', newToken);
      localStorage.setItem('irisiv_user', JSON.stringify(newUser));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('irisiv_token');
      localStorage.removeItem('irisiv_user');
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'NGO',
        organizationId: user?.organizationId,
        loginAs,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    // Return default fallback if used outside Provider
    return {
      user: {
        id: 'prof-ngo-1',
        email: 'ananya@shikshafoundation.org',
        name: 'Ananya Sharma',
        role: 'NGO',
        organizationId: 'org-ngo-1',
        organizationName: 'Shiksha Foundation',
      },
      token: 'token-demo-ngo',
      role: 'NGO',
      organizationId: 'org-ngo-1',
      loginAs: () => {},
      setAuth: () => {},
      logout: () => {},
    };
  }
  return context;
}
