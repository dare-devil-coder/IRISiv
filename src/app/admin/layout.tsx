'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  User,
  LogOut,
  Layers,
  Users,
  Building2,
  Briefcase,
  FileText,
  Activity,
} from 'lucide-react';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [resetting, setResetting] = useState(false);

  const navItems = [
    { href: '/admin/dashboard', label: 'Admin Dashboard' },
    { href: '/admin/kyc', label: 'KYC Applications' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/ngos', label: 'NGOs' },
    { href: '/admin/companies', label: 'Companies' },
    { href: '/admin/businesses', label: 'Businesses' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/tenders', label: 'Tenders' },
  ];

  const handleResetDemo = async () => {
    if (!confirm('Are you sure you want to reset all demo projects and KYC records?')) return;
    setResetting(true);
    try {
      await fetch('/api/admin/reset', { method: 'POST' });
      window.location.reload();
    } catch {
      alert('Failed to reset demo state.');
    } finally {
      setResetting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('irisiv_auth_token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Dedicated Admin Portal Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-300 bg-slate-900 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-rose-600 border border-rose-500 flex items-center justify-center text-white shadow-xs">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white font-sans">
                  IRIS<span className="text-rose-400">iv</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                  COMPLIANCE ADMIN
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline text-slate-700">|</span>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span>Security Level: <strong>Tier-1 Compliance</strong></span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              disabled={resetting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Reset Seed Data</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="hidden md:inline font-semibold">Admin (KYC Officer)</span>
              </div>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Bar for Admin */}
        <div className="border-t border-slate-800 bg-slate-950 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Role Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
