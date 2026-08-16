'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import {
  Shield,
  RotateCcw,
  User,
  Layers,
  FileText,
  Building2,
  Briefcase,
  Star,
  Bell,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface NavbarProps {
  currentRole?: UserRole | 'LANDING';
  onRoleChange?: (newRole: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole = 'LANDING', onRoleChange }) => {
  const router = useRouter();
  const pathname = usePathname();
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
      await fetch('/api/admin/reset', { method: 'POST' });
      window.location.reload();
    } catch {
      alert('Failed to reset demo state.');
    } finally {
      setResetting(false);
    }
  };

  // Role-specific secondary navigation links
  const getNavLinks = () => {
    switch (currentRole) {
      case 'NGO':
        return [
          { href: '/ngo/dashboard', label: 'Dashboard' },
          { href: '/ngo/requirements/new', label: 'Requirements' },
          { href: '/ngo/dashboard#projects', label: 'Projects' },
          { href: '/ngo/status', label: 'Status' },
          { href: '/ngo/reviews', label: 'Reviews' },
          { href: '/ngo/notifications', label: 'Notifications' },
          { href: '/auth/status', label: 'Profile / KYC' },
        ];
      case 'CORPORATE':
        return [
          { href: '/corporate/dashboard', label: 'Dashboard' },
          { href: '/corporate/dashboard#new-projects', label: 'New Projects' },
          { href: '/corporate/dashboard#ongoing-projects', label: 'Ongoing Projects' },
          { href: '/corporate/dashboard#completed-projects', label: 'Completed Projects' },
          { href: '/corporate/status', label: 'Status' },
          { href: '/corporate/reviews', label: 'Reviews' },
          { href: '/corporate/notifications', label: 'Notifications' },
          { href: '/auth/status', label: 'Profile / KYC' },
        ];
      case 'BUSINESS':
        return [
          { href: '/business/dashboard', label: 'Dashboard' },
          { href: '/business/dashboard#available-tenders', label: 'Available Tenders' },
          { href: '/business/dashboard#my-tenders', label: 'My Tenders' },
          { href: '/business/status', label: 'Status' },
          { href: '/business/reviews', label: 'Reviews' },
          { href: '/business/notifications', label: 'Notifications' },
          { href: '/auth/status', label: 'Profile / KYC' },
        ];
      case 'ADMIN':
        return [
          { href: '/admin/dashboard', label: 'Dashboard' },
          { href: '/admin/dashboard#kyc', label: 'KYC Applications' },
          { href: '/admin/dashboard#users', label: 'Users' },
          { href: '/admin/dashboard#ngos', label: 'NGOs' },
          { href: '/admin/dashboard#companies', label: 'Companies' },
          { href: '/admin/dashboard#businesses', label: 'Businesses' },
          { href: '/admin/dashboard#projects', label: 'Projects' },
          { href: '/admin/dashboard#tenders', label: 'Tenders' },
        ];
      default:
        return [
          { href: '#how-it-works', label: 'How It Works' },
          { href: '#for-ngos', label: 'For NGOs' },
          { href: '#for-companies', label: 'For Companies' },
          { href: '#for-businesses', label: 'For Businesses' },
          { href: '#about-us', label: 'About Us' },
          { href: '/auth/login', label: 'Login' },
          { href: '/auth/signup', label: 'Sign Up' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Bar */}
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
              CSR TRUST PLATFORM
            </span>
          </div>
        </Link>

        {/* Center: Portal Role Switcher */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <span className="text-[11px] font-medium text-slate-500 px-2 flex items-center gap-1">
            <Layers className="h-3 w-3 text-slate-400" />
            Portal:
          </span>
          {(['NGO', 'CORPORATE', 'BUSINESS', 'ADMIN'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleSwitch(r)}
              className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                currentRole === r
                  ? 'bg-white text-slate-900 border border-slate-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {r === 'CORPORATE' ? 'COMPANY' : r}
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
            <span className="hidden md:inline font-medium">Reset Demo</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200" />

          {/* Active Role Tag */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-xs font-mono">
            <User className="h-3.5 w-3.5 text-teal-700" />
            <span className="text-teal-900 font-bold">
              {currentRole === 'LANDING' ? 'Public' : currentRole === 'CORPORATE' ? 'COMPANY' : currentRole}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Bar for Role Portals */}
      {currentRole !== 'LANDING' && (
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHighlight = link.label.startsWith('+');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    isHighlight
                      ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                      : isActive
                      ? 'bg-white text-teal-800 border border-teal-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
