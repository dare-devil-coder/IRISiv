'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import {
  Shield,
  User,
  LogOut,
  Building2,
  Briefcase,
  Users,
  ShieldAlert,
} from 'lucide-react';

interface NavbarProps {
  currentRole?: UserRole | 'LANDING';
  onRoleChange?: (newRole: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole = 'LANDING' }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('irisiv_auth_token');
    router.push('/');
  };

  const getRoleConfig = () => {
    switch (currentRole) {
      case 'NGO':
        return {
          title: 'NGO Portal',
          icon: <Users className="h-4 w-4 text-teal-600" />,
          badge: 'bg-teal-50 text-teal-800 border-teal-200',
          home: '/ngo/dashboard',
        };
      case 'CORPORATE':
        return {
          title: 'Company Portal',
          icon: <Building2 className="h-4 w-4 text-indigo-600" />,
          badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          home: '/company/dashboard',
        };
      case 'BUSINESS':
        return {
          title: 'Vendor Portal',
          icon: <Briefcase className="h-4 w-4 text-amber-600" />,
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          home: '/business/dashboard',
        };
      case 'ADMIN':
        return {
          title: 'Compliance Admin',
          icon: <ShieldAlert className="h-4 w-4 text-rose-600" />,
          badge: 'bg-rose-50 text-rose-800 border-rose-200',
          home: '/admin/dashboard',
        };
      default:
        return null;
    }
  };

  const config = getRoleConfig();

  // On landing / public pages, render clean public header
  if (currentRole === 'LANDING' || !config) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-teal-600 border border-teal-700 flex items-center justify-center text-white shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 font-sans leading-none">
                IRIS<span className="text-teal-600">iv</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                CSR TRUST & TENDER PLATFORM
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/#how-it-works" className="hover:text-teal-600 transition">How It Works</Link>
            <Link href="/#for-ngos" className="hover:text-teal-600 transition">For NGOs</Link>
            <Link href="/#for-companies" className="hover:text-teal-600 transition">For Companies</Link>
            <Link href="/#for-businesses" className="hover:text-teal-600 transition">For Businesses</Link>
            <Link href="/#about-us" className="hover:text-teal-600 transition">About Us</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition">
              Login
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Role Header (Clean, role-specific, NO portal switcher)
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={config.home} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
            {config.icon}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-slate-900 font-sans">
              IRIS<span className="text-teal-600">iv</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${config.badge}`}>
              {config.title.toUpperCase()}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
