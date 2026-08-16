'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { DEMO_ORGANIZATIONS } from '@/lib/constants/demo';
import { Building2, ShieldCheck } from 'lucide-react';

export default function AdminCompaniesPage() {
  const companies = DEMO_ORGANIZATIONS.filter((o) => o.type === 'CORPORATE');

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
            <span className="text-xs text-slate-500 font-medium">Corporate Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-600" />
            Corporate CSR Sponsors & Enterprises
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Companies with mandated 2% CSR budgets funding verified social impact projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((corp) => (
            <div key={corp.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {corp.id}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  VERIFIED ACTIVE ✓
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{corp.name}</h3>
              <p className="text-xs text-slate-600">Location: {corp.location || 'Bengaluru, Karnataka'}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>Annual CSR Budget: <strong className="text-slate-900 font-mono">₹2.4 Cr</strong></span>
                <span className="font-mono">CIN: U72200KA2015PTC</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
