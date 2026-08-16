'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-teal-600 border border-teal-700 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
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

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <Link href="/#how-it-works" className="hover:text-teal-600 transition-colors">
            How It Works
          </Link>
          <Link href="/#for-ngos" className="hover:text-teal-600 transition-colors">
            For NGOs
          </Link>
          <Link href="/#for-companies" className="hover:text-teal-600 transition-colors">
            For Companies
          </Link>
          <Link href="/#for-businesses" className="hover:text-teal-600 transition-colors">
            For Businesses
          </Link>
          <Link href="/#about-us" className="hover:text-teal-600 transition-colors">
            About Us
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
