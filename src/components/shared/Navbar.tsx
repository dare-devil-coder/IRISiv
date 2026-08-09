'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { Shield, RotateCcw, User, Layers } from 'lucide-react';

interface NavbarProps {
  currentRole?: UserRole | 'LANDING';
  onRoleChange?: (newRole: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole = 'LANDING', onRoleChange }) => {
  const router = useRouter();
  const [resetting, setResetting] = useState(false);

  const handleRoleSwitch = (role: UserRole) => {
    if (onRoleChange) onRoleChange(role);
    switch (role) {
      case 'NGO':
        router.push('/ngo/dashboard');
        break;
      case 'CORPORATE':
        router.push('/corporate/dashboard');
        break;
      case 'BUSINESS':
        router.push('/business/dashboard');
        break;
      case 'ADMIN':
        router.push('/admin/dashboard');
        break;
    }
  };

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
      window.location.reload();
    } catch {
      alert('Failed to reset demo state.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-teal-600 border border-teal-700 flex items-center justify-center text-white shadow-sm">
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-slate-900 font-sans">
              IRIS<span className="text-teal-600">iv</span>
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              TRUST ENGINE
            </span>
          </div>
        </Link>

        {/* Center: Role Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <span className="text-[11px] font-medium text-slate-500 px-2.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            Portal View:
          </span>
          {(['NGO', 'CORPORATE', 'BUSINESS', 'ADMIN'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleSwitch(r)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-xs ${
                currentRole === r
                  ? 'bg-white text-slate-900 border border-slate-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDemo}
            disabled={resetting}
            title="Reset to initial hackathon demo seed state"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs transition-colors shadow-sm"
          >
            <RotateCcw className={`h-3.5 w-3.5 text-slate-500 ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline font-medium">Reset Demo State</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200" />

          {/* Active Role Tag */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono">
            <User className="h-3.5 w-3.5 text-teal-600" />
            <span className="text-slate-800 font-semibold">
              {currentRole === 'LANDING' ? 'Overview' : `${currentRole} Active`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
