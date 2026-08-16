'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Tender, TenderQuotation, CSRProject } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  IndianRupee,
  Cpu,
  ArrowRight,
  RotateCcw,
  Building2,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';

export default function BusinessDashboardPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, pRes] = await Promise.all([
        fetch('/api/tenders?status=OPEN').catch(() => null),
        fetch('/api/projects?role=BUSINESS').catch(() => null),
      ]);

      if (tRes && tRes.ok) {
        const tJson = await tRes.json();
        if (tJson.success) setTenders(tJson.data);
      }
      if (pRes && pRes.ok) {
        const pJson = await pRes.json();
        if (pJson.success) setProjects(pJson.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeExecutionProjects = projects.filter(
    (p) =>
      ['BUSINESS_SELECTED', 'CONTRACTED', 'ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING'].includes(p.status)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                GREENGROW EDUCATIONAL SUPPLIES LTD
              </span>
              <span className="text-xs text-slate-400 font-mono">KYC: ACTIVE ✓</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-purple-600" />
              Vendor Tender & Contract Execution Portal
            </h1>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Available Matching Tenders</span>
            <div className="text-2xl font-black text-purple-900 font-mono mt-1">{tenders.length}</div>
            <span className="text-[10px] text-slate-500">Open for Quotations</span>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-teal-800 block">Contracts Won / Executing</span>
            <div className="text-2xl font-black text-teal-950 font-mono mt-1">{activeExecutionProjects.length}</div>
            <span className="text-[10px] text-teal-700">In Execution</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 block">Disbursed Payments</span>
            <div className="text-2xl font-black text-emerald-950 font-mono mt-1">₹1,96,400</div>
            <span className="text-[10px] text-emerald-700">20% Advance & 40% Milestones</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Completed CSR Contracts</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {projects.filter((p) => p.status === 'COMPLETED').length}
            </div>
            <span className="text-[10px] text-slate-500">100% Disbursed</span>
          </div>
        </div>

        {/* SECTION 1: AVAILABLE TENDERS MATCHING DOMAIN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Available CSR Procurement Tenders</h2>
              <p className="text-xs text-slate-500">Tenders broadcasted matching your verified business domain</p>
            </div>
          </div>

          {tenders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">No Open Tenders Currently Available</h3>
              <p className="text-xs text-slate-500 mt-1">You will receive an automated broadcast when a new matching tender is opened.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tenders.map((t) => (
                <div key={t.id} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-purple-700">{t.tender_code}</span>
                        <StatusBadge status="TENDER_OPEN" size="sm" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{t.title}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">Ceiling Budget</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">₹{(t.max_budget || t.budget || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{t.description}</p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase block">Quantity</span>
                      <span className="font-bold text-slate-800">{t.target_quantity} {t.target_unit || 'units'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase block">Timeline</span>
                      <span className="font-bold text-slate-800">{t.delivery_deadline_days} Days</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase block">Closing</span>
                      <span className="font-bold text-amber-800">5 Days Left</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/business/tenders/${t.id}/quotation`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      <span>Submit Blind Quotation</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: MY TENDERS & CONTRACTS (CORE REQUIREMENT) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Submitted Tenders & Execution Contracts</h2>
              <p className="text-xs text-slate-500">Track AI scoring, vendor selection result, and 20/40/40 milestone payouts</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase">
                  <th className="p-3.5">Tender / Project</th>
                  <th className="p-3.5">Funder & NGO</th>
                  <th className="p-3.5">Contract / Bid (₹)</th>
                  <th className="p-3.5">Status & Result</th>
                  <th className="p-3.5">Payment (20/40/40)</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => {
                  const contractVal = p.contract_value || p.estimated_budget;
                  const isWon = !['DRAFT', 'SUBMITTED', 'CORPORATE_INTERESTED', 'TENDER_OPEN', 'REJECTED'].includes(p.status);
                  const isAdvPaid = ['ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(p.status);
                  const isMilestonePaid = ['MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(p.status);
                  const isFinalPaid = ['FINAL_40_PAID', 'COMPLETED'].includes(p.status);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{p.title}</span>
                        <span className="text-[10px] font-mono text-purple-700">{p.project_code}</span>
                      </td>

                      <td className="p-3.5 text-slate-700">
                        <span className="block font-semibold">{p.corporate_organization?.name || 'Apex Tech'}</span>
                        <span className="text-[10px] text-slate-400">NGO: {p.ngo_organization?.name || 'Shiksha Foundation'}</span>
                      </td>

                      <td className="p-3.5 font-mono font-bold text-slate-900 text-sm">
                        ₹{contractVal.toLocaleString()}
                      </td>

                      <td className="p-3.5">
                        {isWon ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              SELECTED / WON
                            </span>
                            <span className="block text-[10px] text-slate-500 font-mono">AI Score: 95.7/100</span>
                          </div>
                        ) : (
                          <StatusBadge status={p.status} size="sm" />
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <span className={isAdvPaid ? 'text-teal-700 font-bold' : 'text-slate-400'}>20% {isAdvPaid ? '✓' : '○'}</span>
                          <span className="text-slate-300">/</span>
                          <span className={isMilestonePaid ? 'text-indigo-700 font-bold' : 'text-slate-400'}>40% {isMilestonePaid ? '✓' : '○'}</span>
                          <span className="text-slate-300">/</span>
                          <span className={isFinalPaid ? 'text-emerald-700 font-bold' : 'text-slate-400'}>40% {isFinalPaid ? '✓' : '○'}</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        {p.status === 'ADVANCE_20_PAID' || p.status === 'IN_PROGRESS' ? (
                          <Link
                            href={`/business/projects/${p.id}/fulfillment`}
                            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1"
                          >
                            <PackageCheck className="h-3.5 w-3.5" />
                            <span>Submit Delivery</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/business/projects/${p.id}/fulfillment`}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
                          >
                            View Contract
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
