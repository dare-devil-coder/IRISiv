'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject } from '@/types';
import { BarChart3, TrendingUp, ArrowLeft } from 'lucide-react';

export default function CorporateAnalyticsPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects?role=CORPORATE')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProjects(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalFunded = projects.reduce((sum, p) => sum + (p.contract_value || p.estimated_budget), 0);
  const totalBeneficiaries = projects.reduce((sum, p) => sum + p.beneficiaries, 0);
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length;

  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <Link
          href="/corporate/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Corporate Dashboard</span>
        </Link>

        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-teal-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Corporate CSR Impact Analytics</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">Real-time metrics, fund distribution, and verified beneficiary outcomes</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Total CSR Funds Committed</span>
            <div className="text-3xl font-black text-slate-900 font-mono mt-2">₹{totalFunded.toLocaleString()}</div>
            <span className="text-xs text-teal-700 mt-1 block font-semibold">100% Milestone Escrow Protected</span>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Target Beneficiaries</span>
            <div className="text-3xl font-black text-emerald-700 font-mono mt-2">{totalBeneficiaries.toLocaleString()}</div>
            <span className="text-xs text-emerald-700 mt-1 block font-semibold">Verified Physical Impact</span>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Completed Projects</span>
            <div className="text-3xl font-black text-teal-700 font-mono mt-2">{completedCount}</div>
            <span className="text-xs text-slate-600 mt-1 block font-medium">Full AI Verification & Audit Seals</span>
          </div>
        </div>

        {/* Category Distribution Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            CSR Fund Allocation by Category
          </h3>

          <div className="space-y-4">
            {categories.map((cat) => {
              const catProjects = projects.filter((p) => p.category === cat);
              const catBudget = catProjects.reduce((sum, p) => sum + (p.contract_value || p.estimated_budget), 0);
              const percent = Math.round((catBudget / (totalFunded || 1)) * 100);

              return (
                <div key={cat} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-800">
                    <span className="font-bold">{cat} ({catProjects.length} Projects)</span>
                    <span className="font-mono font-bold text-teal-700">₹{catBudget.toLocaleString()} ({percent}%)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
