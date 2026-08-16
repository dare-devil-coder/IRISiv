'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { AccountStatus } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileText,
  RotateCcw,
} from 'lucide-react';

export default function AccountStatusPage() {
  const [accountState, setAccountState] = useState<AccountStatus>('KYC_PENDING');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="LANDING" />

      <div className="max-w-xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        {/* Interactive State Demo Switcher */}
        <div className="mb-4 p-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Demo KYC State Preview:</span>
          <div className="flex gap-1">
            {(['KYC_PENDING', 'KYC_APPROVED', 'KYC_REJECTED', 'ACTIVE'] as AccountStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setAccountState(s)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold ${
                  accountState === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden p-8 space-y-6 text-center">
          {/* PENDING STATE */}
          {accountState === 'KYC_PENDING' && (
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-full bg-amber-50 border border-amber-200 text-amber-600 animate-pulse">
                <Clock className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your KYC Application is Under Review</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                We have received your organization verification documents. The IRISiv compliance team is currently validating your 12A/80G, PAN, and signatory authorizations.
              </p>
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5">
                <span className="font-bold block">Application Summary:</span>
                <p>• Organization: <strong>Navjeevan Rural Welfare Society</strong></p>
                <p>• Status: <StatusBadge status="KYC_PENDING" size="sm" /></p>
                <p>• Estimated Review Time: <strong>Within 24 business hours</strong></p>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs text-teal-700 font-bold hover:underline"
                >
                  <span>Go to Admin Dashboard to simulate KYC approval</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* REJECTED STATE */}
          {accountState === 'KYC_REJECTED' && (
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-full bg-rose-50 border border-rose-200 text-rose-600">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your KYC Application Requires Correction</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                The compliance reviewer requested clarifications or updated documents before access can be unlocked.
              </p>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-left text-xs text-rose-900 space-y-1.5">
                <span className="font-bold block">Reason for Rejection / Correction:</span>
                <p className="font-mono text-xs">"GST registration certificate expired on 31-Dec-2025 and authorized signatory stamp is missing from page 2."</p>
              </div>
              <div className="pt-2">
                <Link
                  href="/auth/signup"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm inline-flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Re-upload Corrected Documents</span>
                </Link>
              </div>
            </div>
          )}

          {/* APPROVED / ACTIVE STATE */}
          {(accountState === 'KYC_APPROVED' || accountState === 'ACTIVE') && (
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Organization Verified & Active ✓</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your organization has been verified by the IRISiv compliance auditor. All platform features and tender operations are unlocked.
              </p>
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-left text-xs text-emerald-950 space-y-1.5">
                <p>• Status: <StatusBadge status="ACTIVE" size="sm" /></p>
                <p>• Verification ID: <span className="font-mono font-bold">IRIS-KYC-2026-9912</span></p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/ngo/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                >
                  Enter NGO Portal
                </Link>
                <Link
                  href="/corporate/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                >
                  Enter Company Portal
                </Link>
                <Link
                  href="/business/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
                >
                  Enter Business Portal
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
