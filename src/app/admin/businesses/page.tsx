'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { DEMO_ORGANIZATIONS } from '@/lib/constants/demo';
import { Briefcase, ShieldCheck } from 'lucide-react';

export default function AdminBusinessesPage() {
  const businesses = DEMO_ORGANIZATIONS.filter((o) => o.type === 'BUSINESS');

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
            <span className="text-xs text-slate-500 font-medium">Vendor Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-amber-600" />
            Verified Business Vendors & Suppliers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Suppliers and service providers eligible to bid on CSR tenders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.map((biz) => (
            <div key={biz.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {biz.id}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  VERIFIED ACTIVE ✓
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{biz.name}</h3>
              <p className="text-xs text-slate-600">Location: {biz.location || 'Pune, Maharashtra'}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>Vendor Rating: <strong className="text-slate-900">4.9 / 5.0 ⭐</strong></span>
                <span className="font-mono">GSTIN: 27AAAAA0000A1Z5</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
