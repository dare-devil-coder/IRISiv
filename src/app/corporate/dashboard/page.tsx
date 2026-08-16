'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { ProjectStatusCard } from '@/components/shared/ProjectStatusCard';
import { ProjectStatusModal } from '@/components/shared/ProjectStatusModal';
import { CompanyLockModal } from '@/components/shared/CompanyLockModal';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  ShieldCheck,
  Building2,
  Cpu,
  Plus,
  RotateCcw,
  IndianRupee,
  Briefcase,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function CorporateDashboardPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [statusModalProject, setStatusModalProject] = useState<CSRProject | null>(null);
  const [lockModalProject, setLockModalProject] = useState<CSRProject | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?role=CORPORATE');
      const json = await res.json();
      if (json.success) setProjects(json.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Filter Categories
  const newDiscoverableProjects = projects.filter((p) => p.status === 'SUBMITTED');
  const lockedProjects = projects.filter((p) => p.status === 'CORPORATE_INTERESTED');
  const activeTenders = projects.filter((p) => p.status === 'TENDER_OPEN');
  const tendersAwaitingSelection = projects.filter((p) => ['TENDER_CLOSED', 'AI_EVALUATED'].includes(p.status));
  const ongoingExecutionProjects = projects.filter(
    (p) =>
      ['CORPORATE_INTERESTED', 'TENDER_OPEN', 'TENDER_CLOSED', 'AI_EVALUATED', 'BUSINESS_SELECTED', 'CONTRACTED', 'ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'MANUAL_REVIEW'].includes(p.status)
  );
  const paymentsPending = projects.filter(
    (p) =>
      ['BUSINESS_SELECTED', 'CONTRACTED', 'FULFILLMENT_SUBMITTED', 'NGO_CONFIRMED'].includes(p.status)
  );
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                APEX GLOBAL TECHNOLOGIES
              </span>
              <span className="text-xs text-slate-400 font-mono">KYC: ACTIVE ✓</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              Company CSR Procurement & Tender Management Portal
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadProjects}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/corporate/tenders/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>+ Open New Tender</span>
            </Link>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">New Needs</span>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">{newDiscoverableProjects.length}</div>
            <span className="text-[9px] text-slate-500">Available to lock</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200 shadow-xs">
            <span className="text-[9px] uppercase font-mono font-bold text-indigo-800 block">Locked Needs</span>
            <div className="text-xl font-black text-indigo-950 font-mono mt-1">{lockedProjects.length}</div>
            <span className="text-[9px] text-indigo-700">Tender Pending</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 shadow-xs">
            <span className="text-[9px] uppercase font-mono font-bold text-amber-800 block">Active Tenders</span>
            <div className="text-xl font-black text-amber-950 font-mono mt-1">{activeTenders.length}</div>
            <span className="text-[9px] text-amber-700">Accepting Bids</span>
          </div>

          <div className="p-3.5 rounded-xl bg-violet-50/50 border border-violet-200 shadow-xs">
            <span className="text-[9px] uppercase font-mono font-bold text-violet-800 block">Awaiting Select</span>
            <div className="text-xl font-black text-violet-950 font-mono mt-1">{tendersAwaitingSelection.length}</div>
            <span className="text-[9px] text-violet-700">AI scored ready</span>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200 shadow-xs">
            <span className="text-[9px] uppercase font-mono font-bold text-teal-800 block">Ongoing Work</span>
            <div className="text-xl font-black text-teal-950 font-mono mt-1">{ongoingExecutionProjects.length}</div>
            <span className="text-[9px] text-teal-700">In Execution</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 shadow-xs">
            <span className="text-[9px] uppercase font-mono font-bold text-emerald-800 block">Pay Action Ready</span>
            <div className="text-xl font-black text-emerald-950 font-mono mt-1">{paymentsPending.length}</div>
            <span className="text-[9px] text-emerald-700">20 / 40 / 40</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Completed</span>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">{completedProjects.length}</div>
            <span className="text-[9px] text-slate-500">100% Verified</span>
          </div>
        </div>

        {/* ACTION REQUIRED AREA */}
        {(paymentsPending.length > 0 || tendersAwaitingSelection.length > 0 || lockedProjects.length > 0) && (
          <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-indigo-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Company Decisions & Milestones Awaiting Action</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Payment Triggers */}
              {paymentsPending.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-white border border-indigo-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">{p.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {['BUSINESS_SELECTED', 'CONTRACTED'].includes(p.status)
                        ? 'Release 20% Advance Payment to begin material procurement.'
                        : p.status === 'FULFILLMENT_SUBMITTED'
                        ? 'Vendor uploaded delivery documents. Release 40% milestone.'
                        : 'NGO physically confirmed receipt. Release Final 40% payment.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setStatusModalProject(p)}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1"
                  >
                    <span>Authorize Payment</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {/* Tenders Awaiting Selection */}
              {tendersAwaitingSelection.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-white border border-violet-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Cpu className="h-3.5 w-3.5 text-violet-600" />
                      <span className="text-xs font-bold text-slate-900">{p.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Tender closed. Featherless AI scored all quotations across 7 factors.</p>
                  </div>
                  <Link
                    href={`/corporate/tenders/${p.tender_id || 'tender-101'}`}
                    className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1"
                  >
                    <span>Review AI Bids & Select Business</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}

              {/* Locked Projects needing Tender creation */}
              {lockedProjects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-white border border-indigo-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">{p.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Project locked. Publish tender to invite vendor quotations.</p>
                  </div>
                  <Link
                    href={`/corporate/tenders/new?projectId=${p.id}`}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1"
                  >
                    <span>Create & Publish Tender</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 1: NEW PROJECTS DISCOVERY (Explicit 3 Information Areas: NGO, Project, AI Report) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">New NGO CSR Requirements Available to Lock</h2>
              <p className="text-xs text-slate-500">Verified NGO needs evaluated by Featherless AI ready for Corporate sponsorship</p>
            </div>
          </div>

          {newDiscoverableProjects.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">All Available NGO Needs Have Been Sponsored</h3>
              <p className="text-xs text-slate-500 mt-1">Check back later or monitor your ongoing CSR projects below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newDiscoverableProjects.map((p) => (
                <div key={p.id} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-teal-700">{p.project_code}</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{p.title}</h3>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ₹{p.estimated_budget.toLocaleString()}
                    </span>
                  </div>

                  {/* 3 Explicit Information Areas */}
                  <div className="space-y-3">
                    {/* AREA 1: NGO DETAILS */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">1. NGO Partner Details</span>
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{p.ngo_organization?.name || 'Shiksha Foundation India'}</span>
                        <span className="text-emerald-700 font-mono text-[10px]">KYC VERIFIED ✓</span>
                      </div>
                      <span className="text-slate-500 block text-[11px]">{p.location}</span>
                    </div>

                    {/* AREA 2: PROJECT DETAILS */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">2. Project Requirements</span>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                        <div>Category: <strong>{p.category}</strong></div>
                        <div>Quantity: <strong>{p.target_quantity} units</strong></div>
                        <div>Beneficiaries: <strong>{p.beneficiaries_impacted || p.target_quantity}</strong></div>
                        <div>Timeline: <strong>30 Days</strong></div>
                      </div>
                    </div>

                    {/* AREA 3: AI REPORT */}
                    <div className="p-3 rounded-xl bg-violet-50/60 border border-violet-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-violet-800 flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          3. Featherless AI Need Report
                        </span>
                        <span className="font-mono font-bold text-[10px] text-violet-900 bg-violet-100 px-1.5 py-0.5 rounded">
                          Feasibility: 94%
                        </span>
                      </div>
                      <p className="text-slate-700 text-[11px] leading-relaxed">
                        Budget is realistic against national averages. Direct community impact meets MCA CSR Schedule VII. Low risk profile.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setLockModalProject(p)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Lock Project for CSR</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: ONGOING CSR PROJECTS & TENDERS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ongoing CSR Projects & Tenders</h2>
              <p className="text-xs text-slate-500">Track and manage the 20/40/40 payment lifecycle for all locked initiatives</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ongoingExecutionProjects.map((p) => (
              <ProjectStatusCard
                key={p.id}
                project={p}
                userRole="CORPORATE"
                onOpenStatusModal={(proj) => setStatusModalProject(proj)}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Status Modal */}
        <ProjectStatusModal
          project={statusModalProject}
          isOpen={!!statusModalProject}
          onClose={() => setStatusModalProject(null)}
          onRefresh={loadProjects}
        />

        {/* Company Lock Confirmation Modal */}
        <CompanyLockModal
          project={lockModalProject}
          isOpen={!!lockModalProject}
          onClose={() => setLockModalProject(null)}
          onSuccess={loadProjects}
        />
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
