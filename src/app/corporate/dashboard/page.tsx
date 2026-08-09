'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject, Tender } from '@/types';
import {
  ShieldCheck,
  Plus,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Cpu,
  Building2,
  Briefcase,
} from 'lucide-react';

export default function CorporateDashboard() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        fetch('/api/projects?role=CORPORATE&orgId=org-corp-1'),
        fetch('/api/tenders'),
      ]);
      const pJson = await pRes.json();
      const tJson = await tRes.json();
      if (pJson.success) setProjects(pJson.data);
      if (tJson.success) setTenders(tJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingApproval = projects.filter((p) => p.status === 'SUBMITTED');
  const needsTender = projects.filter((p) => p.status === 'CORPORATE_INTERESTED' && !p.tender_id);
  const openTenders = tenders.filter((t) => t.status === 'OPEN');
  const needsPaymentRelease = projects.filter((p) =>
    ['CONTRACTED', 'NGO_CONFIRMED', 'MANUAL_REVIEW'].includes(p.status)
  );
  const completed = projects.filter((p) => p.status === 'COMPLETED');

  const totalCommitted = projects.reduce((sum, p) => sum + (p.contract_value || p.estimated_budget), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Corporate CSR Portal</h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Apex Global Technologies
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Review NGO requirements, issue CSR procurement tenders, compare AI-scored quotations & authorize 20/40/40 payments.</p>
          </div>
          <Link
            href="/corporate/tenders/new"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Tender</span>
          </Link>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Total CSR Portfolio</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">₹{(totalCommitted / 100000).toFixed(1)}L</div>
            <span className="text-[11px] text-slate-500 mt-1 block font-medium">{projects.length} Total Projects</span>
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm ${pendingApproval.length > 0 ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
            <span className="text-xs text-amber-900 font-mono font-bold uppercase">NGO Requirements Awaiting Review</span>
            <div className="text-2xl font-black text-amber-900 font-mono mt-1">{pendingApproval.length}</div>
            <span className="text-[11px] text-amber-800 mt-1 block font-semibold">Need corporate interest</span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Active Open Tenders</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{openTenders.length}</div>
            <span className="text-[11px] text-emerald-700 mt-1 block font-semibold">Accepting vendor bids</span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Completed Impact Projects</span>
            <div className="text-2xl font-black text-teal-700 font-mono mt-1">{completed.length}</div>
            <span className="text-[11px] text-slate-500 mt-1 block font-medium">100% verified by NGO & AI</span>
          </div>
        </div>

        {/* Action Required Alert Box */}
        {(pendingApproval.length > 0 || needsTender.length > 0 || needsPaymentRelease.length > 0) && (
          <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-900 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-emerald-700 shrink-0" />
              <h2 className="text-sm font-bold text-emerald-950">Action Needed on Your CSR Portfolio</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {pendingApproval.length > 0 && (
                <div className="p-3 rounded-xl bg-white border border-emerald-200">
                  <span className="font-bold text-emerald-950 block">{pendingApproval.length} NGO Requirement(s)</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">Review and express interest to start procurement.</p>
                </div>
              )}
              {needsTender.length > 0 && (
                <div className="p-3 rounded-xl bg-white border border-emerald-200">
                  <span className="font-bold text-emerald-950 block">{needsTender.length} Approved Project(s)</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">Create and publish procurement tenders.</p>
                </div>
              )}
              {needsPaymentRelease.length > 0 && (
                <div className="p-3 rounded-xl bg-white border border-emerald-200">
                  <span className="font-bold text-emerald-950 block">{needsPaymentRelease.length} Milestone Action(s)</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">Record 20% advance or release final 40% payment.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 1: Active Tenders */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              CSR Procurement Tenders ({tenders.length})
            </h2>
            <Link href="/corporate/tenders/new" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" /> Create Tender
            </Link>
          </div>

          {tenders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No tenders created yet. Click above to issue your first CSR tender.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4 font-bold">Code</th>
                    <th className="p-4 font-bold">Tender Title</th>
                    <th className="p-4 font-bold hidden sm:table-cell">Budget</th>
                    <th className="p-4 font-bold hidden md:table-cell">Quotations</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tenders.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-emerald-700">{t.tender_code}</td>
                      <td className="p-4 font-semibold text-slate-900">{t.title}</td>
                      <td className="p-4 font-mono font-bold text-slate-900 hidden sm:table-cell">₹{t.budget.toLocaleString()}</td>
                      <td className="p-4 font-mono font-bold text-indigo-700 hidden md:table-cell">
                        {t.quotations ? t.quotations.length : 0} bids
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${
                          t.status === 'OPEN' ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/corporate/tenders/${t.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                        >
                          <span>Review & Score</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: All Corporate CSR Projects */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-teal-600" />
              Corporate CSR Projects ({projects.length})
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500">20 / 40 / 40 Milestone Ledger</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 animate-pulse">Loading projects...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4 font-bold">Code</th>
                    <th className="p-4 font-bold">Project Title</th>
                    <th className="p-4 font-bold hidden sm:table-cell">Beneficiaries</th>
                    <th className="p-4 font-bold hidden md:table-cell">Budget</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-teal-700">{p.project_code}</td>
                      <td className="p-4 font-semibold text-slate-900 max-w-[200px]">
                        <span className="line-clamp-1">{p.title}</span>
                      </td>
                      <td className="p-4 font-mono font-semibold hidden sm:table-cell">{p.beneficiaries.toLocaleString()}</td>
                      <td className="p-4 font-mono font-bold text-slate-900 hidden md:table-cell">₹{p.estimated_budget.toLocaleString()}</td>
                      <td className="p-4"><StatusBadge status={p.status} size="sm" /></td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/corporate/projects/${p.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                        >
                          <span>Manage</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
