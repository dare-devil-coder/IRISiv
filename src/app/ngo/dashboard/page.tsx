'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { ProjectStatusCard } from '@/components/shared/ProjectStatusCard';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  Building2,
  Plus,
  RotateCcw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Cpu,
} from 'lucide-react';

export default function NGODashboardPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?role=NGO');
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

  // Filter Projects by Action Required
  const aiReportsPending = projects.filter((p) => p.status === 'NGO_REVIEW' || p.status === 'AI_ANALYZING');
  const deliveryChecksPending = projects.filter(
    (p) => p.status === 'FULFILLMENT_SUBMITTED' || p.status === 'MILESTONE_40_PAID' || p.status === 'NGO_CONFIRMATION_PENDING'
  );
  const lockedProjects = projects.filter((p) => p.status === 'CORPORATE_INTERESTED');
  const ongoingProjects = projects.filter(
    (p) =>
      !['DRAFT', 'AI_ANALYZING', 'NGO_REVIEW', 'SUBMITTED', 'COMPLETED', 'REJECTED'].includes(p.status)
  );
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="NGO" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full flex-1">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                SHIKSHA FOUNDATION INDIA
              </span>
              <span className="text-xs text-slate-400 font-mono">KYC: ACTIVE ✓</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-teal-600" />
              NGO CSR Requirement & Execution Portal
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
              href="/ngo/requirements/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>Submit New Requirement</span>
            </Link>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Total Requirements</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{projects.length}</div>
            <span className="text-[10px] text-slate-500">All CSR needs</span>
          </div>

          <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-200 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-violet-800 block">AI Reports Pending</span>
            <div className="text-2xl font-black text-violet-950 font-mono mt-1">{aiReportsPending.length}</div>
            <span className="text-[10px] text-violet-700">Review & Approve</span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-indigo-800 block">Projects Locked</span>
            <div className="text-2xl font-black text-indigo-950 font-mono mt-1">{lockedProjects.length}</div>
            <span className="text-[10px] text-indigo-700">Corporate sponsor ready</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-800 block">Ongoing Projects</span>
            <div className="text-2xl font-black text-amber-950 font-mono mt-1">{ongoingProjects.length}</div>
            <span className="text-[10px] text-amber-700">In Tender / Execution</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 block">Completed Projects</span>
            <div className="text-2xl font-black text-emerald-950 font-mono mt-1">{completedProjects.length}</div>
            <span className="text-[10px] text-emerald-700">Impact certified</span>
          </div>
        </div>

        {/* ACTION REQUIRED SECTION */}
        {(aiReportsPending.length > 0 || deliveryChecksPending.length > 0) && (
          <div className="p-6 rounded-2xl border-2 border-amber-200 bg-amber-50/40 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Action Required by NGO Ground Team</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Pending AI Report Approvals */}
              {aiReportsPending.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Cpu className="h-3.5 w-3.5 text-violet-600" />
                      <span className="text-xs font-bold text-slate-900">{p.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Featherless AI structured report is ready for your review and sign-off.</p>
                  </div>
                  <Link
                    href={`/ngo/projects/${p.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shrink-0 shadow-sm"
                  >
                    Review AI Report
                  </Link>
                </div>
              ))}

              {/* Pending Physical Delivery Checks */}
              {deliveryChecksPending.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                      <span className="text-xs font-bold text-slate-900">{p.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Vendor delivered items. Physical ground inspection & sign-off required.</p>
                  </div>
                  <Link
                    href={`/ngo/projects/${p.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 shadow-sm"
                  >
                    Confirm Delivery
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY CSR PROJECTS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My CSR Requirements & Projects</h2>
              <p className="text-xs text-slate-500">Complete multi-dimensional lifecycle status for each community need</p>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">No CSR Requirements Submitted Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Submit your first community requirement to initiate AI analysis.</p>
              <div className="mt-4">
                <Link
                  href="/ngo/requirements/new"
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Requirement</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectStatusCard
                  key={project.id}
                  project={project}
                  userRole="NGO"
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AIAssistantDrawer currentRole="NGO" />
    </div>
  );
}
