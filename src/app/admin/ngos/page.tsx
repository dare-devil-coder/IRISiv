'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { DEMO_ORGANIZATIONS } from '@/lib/constants/demo';
import { Building2, ShieldCheck, MapPin } from 'lucide-react';

export default function AdminNGOsPage() {
  const ngos = DEMO_ORGANIZATIONS.filter((o) => o.type === 'NGO');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="ADMIN" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
              ADMIN PORTAL
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">NGO Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-teal-600" />
            Verified Non-Governmental Organizations (NGOs)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compliant non-profit partners with active 12A/80G registrations and CSR-1 certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ngos.map((ngo) => (
            <div key={ngo.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {ngo.id}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  VERIFIED ACTIVE ✓
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{ngo.name}</h3>
              <p className="text-xs text-slate-600">Location: {ngo.location || 'New Delhi, India'}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>Trust Score: <strong className="text-slate-900">{ngo.trust_score || 95}/100</strong></span>
                <span className="font-mono">CSR-1: Verified</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
