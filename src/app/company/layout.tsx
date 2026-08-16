'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  ShieldCheck,
  Briefcase,
  Layers,
  Activity,
  Star,
  Bell,
  User,
  LogOut,
  Plus,
} from 'lucide-react';

export default function CompanyPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/company/dashboard', label: 'Company Dashboard' },
    { href: '/company/new-projects', label: 'New Projects' },
    { href: '/company/ongoing', label: 'Ongoing Projects' },
    { href: '/company/completed', label: 'Completed Projects' },
    { href: '/company/status', label: 'Status' },
    { href: '/company/reviews', label: 'Reviews' },
    { href: '/company/notifications', label: 'Notifications' },
    { href: '/auth/status', label: 'Profile / KYC' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('irisiv_auth_token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Dedicated Company Portal Header */}
      <header className="sticky top-0 z-40 w-full border-b border-indigo-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/company/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 border border-indigo-700 flex items-center justify-center text-white shadow-xs">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 font-sans">
                  IRIS<span className="text-indigo-600">iv</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                  COMPANY PORTAL
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline text-slate-300">|</span>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Apex Global Technologies</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                KYC: ACTIVE ✓
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/company/tenders/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Create Tender</span>
            </Link>

            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden md:inline font-semibold">Rahul M.</span>
              </div>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Bar for Company */}
        <div className="border-t border-slate-100 bg-slate-50/90 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/company/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white text-indigo-900 border border-indigo-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
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
