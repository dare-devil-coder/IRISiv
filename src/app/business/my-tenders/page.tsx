'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Briefcase,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Truck,
  RotateCcw,
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function BusinessMyTendersPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMyTenders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?role=BUSINESS');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyTenders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                BUSINESS VENDOR PORTAL
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">Bids, Execution & Payout Tracking</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">My Submitted Tenders & Contracts</h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your quotation evaluations, contract awards, advance disbursements, and delivery submissions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadMyTenders}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/business/tenders"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition"
            >
              + Find New Tenders
            </Link>
          </div>
        </div>

        {/* List of My Tenders */}
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-amber-50 border border-amber-200 text-amber-600">
              <Briefcase className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Bids Submitted Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't submitted quotations for any CSR tenders yet. Explore available tenders matching your domain.
            </p>
            <Link
              href="/business/tenders"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-sm hover:bg-amber-600"
            >
              <span>Explore Available Tenders</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => {
              const contractVal = project.contract_value || project.estimated_budget;
              const isSelected = ['BUSINESS_SELECTED', 'CONTRACTED', 'ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(project.status);

              return (
                <div
                  key={project.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        {project.project_code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{project.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={project.status} size="sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Tender & Sponsor</span>
                      <p className="font-bold text-slate-800">Apex Global Technologies</p>
                      <p className="text-slate-500">For: {project.ngo_organization?.name || 'Shiksha Foundation'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Contract Value</span>
                      <p className="font-mono font-black text-slate-900 text-sm">₹{contractVal.toLocaleString()}</p>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        {isSelected ? 'Awarded Contract' : 'Quoted Bid'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">AI Score & Ranking</span>
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                        <span className="font-bold text-purple-900 font-mono">94/100 (Rank #1)</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Highest feasibility fit</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Payment Disbursed</span>
                      <p className="font-mono font-bold text-emerald-800">
                        {project.status === 'ADVANCE_20_PAID'
                          ? '20% Paid (₹' + Math.round(contractVal * 0.2).toLocaleString() + ')'
                          : project.status === 'MILESTONE_40_PAID'
                          ? '60% Paid (20% + 40%)'
                          : project.status === 'FINAL_40_PAID' || project.status === 'COMPLETED'
                          ? '100% Paid (Full)'
                          : '0% Advance Pending'}
                      </p>
                      <span className="text-[10px] text-slate-500">Direct escrow bank release</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'}`}>
                        {isSelected ? 'Contract Awarded ✓' : 'Under Evaluation'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isSelected && ['ADVANCE_20_PAID', 'IN_PROGRESS'].includes(project.status) && (
                        <Link
                          href={`/business/projects/${project.id}/fulfillment`}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                        >
                          <Truck className="h-4 w-4" />
                          <span>Submit Delivery Proof</span>
                        </Link>
                      )}

                      <Link
                        href="/business/status"
                        className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-xs transition"
                      >
                        View Status
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
