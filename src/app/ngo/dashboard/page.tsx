'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject } from '@/types';
import { Plus, AlertTriangle, ArrowRight, FileText, CheckCircle2, Clock, BarChart3 } from 'lucide-react';

export default function NGODashboard() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects?role=NGO&orgId=org-ngo-1')
      .then((res) => res.json())
      .then((json) => { if (json.success) setProjects(json.data); })
      .finally(() => setLoading(false));
  }, []);

  const active = projects.filter((p) => ['ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID'].includes(p.status));
  const pendingAction = projects.filter((p) => ['FULFILLMENT_SUBMITTED', 'NGO_CONFIRMATION_PENDING', 'MILESTONE_40_PAID'].includes(p.status));
  const completed = projects.filter((p) => p.status === 'COMPLETED');
  const awaitingCorp = projects.filter((p) => ['SUBMITTED', 'NGO_REVIEW', 'AI_ANALYZING'].includes(p.status));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="NGO" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">NGO Partner Portal</h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Shiksha Foundation
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Submit requirements, track active CSR execution, and confirm physical fulfillment.</p>
          </div>
          <Link
            href="/ngo/requirements/new"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Create Requirement</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Active Projects</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{active.length}</div>
            <span className="text-[11px] text-teal-700 font-semibold mt-1 block">In execution</span>
          </div>
          <div className={`p-5 rounded-2xl border shadow-sm ${pendingAction.length > 0 ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
            <span className="text-xs text-amber-900 font-mono font-bold uppercase">Action Required</span>
            <div className="text-2xl font-black text-amber-900 font-mono mt-1">{pendingAction.length}</div>
            <span className="text-[11px] text-amber-800 mt-1 block font-bold">Needs your review</span>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Awaiting Corporate</span>
            <div className="text-2xl font-black text-blue-700 font-mono mt-1">{awaitingCorp.length}</div>
            <span className="text-[11px] text-blue-700 font-semibold mt-1 block">Pending review</span>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Completed</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{completed.length}</div>
            <span className="text-[11px] text-slate-600 mt-1 block font-medium">Impact generated</span>
          </div>
        </div>

        {/* Action Alert */}
        {pendingAction.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 animate-bounce shrink-0" />
              <div>
                <span className="font-bold text-sm text-amber-900">Physical Confirmation Required</span>
                <p className="text-amber-800 mt-0.5">
                  The vendor has submitted fulfillment proof for {pendingAction[0].project_code}. Please conduct your physical inspection and confirm.
                </p>
              </div>
            </div>
            <Link
              href={`/ngo/projects/${pendingAction[0].id}`}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors shadow-sm"
            >
              Confirm Now
            </Link>
          </div>
        )}

        {/* Projects Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              NGO CSR Project Records
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500">{projects.length} Total</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 animate-pulse">Loading your projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No requirements yet. Create your first CSR project requirement.</p>
              <Link href="/ngo/requirements/new" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold">
                <Plus className="h-4 w-4" /> Create Requirement
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4 font-bold">Code</th>
                    <th className="p-4 font-bold">Project Title</th>
                    <th className="p-4 font-bold hidden sm:table-cell">Category</th>
                    <th className="p-4 font-bold hidden md:table-cell">Beneficiaries</th>
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
                      <td className="p-4 hidden sm:table-cell">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200">{p.category}</span>
                      </td>
                      <td className="p-4 font-mono font-semibold hidden md:table-cell">{p.beneficiaries.toLocaleString()}</td>
                      <td className="p-4 font-mono font-bold text-slate-900 hidden md:table-cell">₹{p.estimated_budget.toLocaleString()}</td>
                      <td className="p-4"><StatusBadge status={p.status} size="sm" /></td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/ngo/projects/${p.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                        >
                          <span>View</span>
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

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Link href="/ngo/requirements/new" className="p-4 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-all flex items-center gap-3">
            <Plus className="h-5 w-5 text-teal-600" />
            <div>
              <p className="text-xs font-bold text-teal-900">New Requirement</p>
              <p className="text-[10px] text-teal-700">Submit a new CSR need</p>
            </div>
          </Link>
          <Link href="/admin/dashboard" className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Audit Logs</p>
              <p className="text-[10px] text-slate-600">View system audit trail</p>
            </div>
          </Link>
          {completed.length > 0 && (
            <Link href={`/corporate/reports/${completed[0].id}`} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Latest Impact Report</p>
                <p className="text-[10px] text-emerald-700">{completed[0].project_code}</p>
              </div>
            </Link>
          )}
        </div>
      </main>

      <AIAssistantDrawer currentRole="NGO" />
    </div>
  );
}
