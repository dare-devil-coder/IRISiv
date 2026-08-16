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

export default function CompanyDashboardPage() {
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
              href="/company/tenders/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Tender</span>
            </Link>
          </div>
        </div>

        {/* 7-Card Operational Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <Link href="/company/new-projects" className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-indigo-400 transition">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">New Projects</span>
            <div className="text-xl font-black text-slate-900 mt-1">{newDiscoverableProjects.length}</div>
            <span className="text-[10px] text-indigo-600 font-medium">Ready to Lock →</span>
          </Link>

          <Link href="/company/ongoing" className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-teal-400 transition">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Locked Projects</span>
            <div className="text-xl font-black text-teal-800 mt-1">{lockedProjects.length}</div>
            <span className="text-[10px] text-teal-600 font-medium">Needs Tender →</span>
          </Link>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Open Tenders</span>
            <div className="text-xl font-black text-amber-800 mt-1">{activeTenders.length}</div>
            <span className="text-[10px] text-slate-400">Accepting bids</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Awaiting Select</span>
            <div className="text-xl font-black text-purple-800 mt-1">{tendersAwaitingSelection.length}</div>
            <span className="text-[10px] text-purple-600 font-medium">AI Scored</span>
          </div>

          <Link href="/company/ongoing" className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-indigo-400 transition">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Ongoing</span>
            <div className="text-xl font-black text-slate-900 mt-1">{ongoingExecutionProjects.length}</div>
            <span className="text-[10px] text-slate-500">In lifecycle</span>
          </Link>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Payment Actions</span>
            <div className="text-xl font-black text-emerald-700 mt-1">{paymentsPending.length}</div>
            <span className="text-[10px] text-emerald-600">20 / 40 / 40</span>
          </div>

          <Link href="/company/completed" className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-400 transition">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Completed</span>
            <div className="text-xl font-black text-slate-900 mt-1">{completedProjects.length}</div>
            <span className="text-[10px] text-emerald-600 font-medium">MCA Certified</span>
          </Link>
        </div>

        {/* SECTION 1: ACTION REQUIRED ALERTS */}
        {ongoingExecutionProjects.length > 0 && (
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-indigo-700" />
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-900">
                Action Required — Pending Decisions
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ongoingExecutionProjects.slice(0, 3).map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-white border border-indigo-200 shadow-xs flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono font-bold text-indigo-700">{p.project_code}</span>
                      <StatusBadge status={p.status} size="sm" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{p.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {p.status === 'CORPORATE_INTERESTED'
                        ? 'Project locked — create tender for vendor bidding.'
                        : p.status === 'TENDER_CLOSED' || p.status === 'AI_EVALUATED'
                        ? 'AI scored all quotations — select winning vendor.'
                        : p.status === 'BUSINESS_SELECTED' || p.status === 'CONTRACTED'
                        ? 'Vendor selected — release 20% advance.'
                        : p.status === 'FULFILLMENT_SUBMITTED'
                        ? 'Proof uploaded — release 40% milestone.'
                        : p.status === 'NGO_CONFIRMED'
                        ? 'NGO verified — release final 40% payment.'
                        : 'Review current stage.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setStatusModalProject(p)}
                    className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Manage Stage →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: NEW APPROVED PROJECTS (Discoverable to Lock) */}
        <div id="new-projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">New Available Projects (AI Approved by NGO)</h2>
                <p className="text-xs text-slate-500">Discover vetted NGO requirements. Locking moves the project to your Ongoing portfolio.</p>
              </div>
            </div>
            <Link href="/company/new-projects" className="text-xs font-bold text-indigo-600 hover:underline">
              View All ({newDiscoverableProjects.length}) →
            </Link>
          </div>

          {newDiscoverableProjects.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6 text-xs text-slate-500">
              No new discoverable projects awaiting corporate lock. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newDiscoverableProjects.map((project) => (
                <ProjectStatusCard
                  key={project.id}
                  project={project}
                  userRole="CORPORATE"
                  onLockProject={() => setLockModalProject(project)}
                  onOpenStatusModal={() => setStatusModalProject(project)}
                />
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: ONGOING PROJECTS PORTFOLIO */}
        <div id="ongoing-projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-teal-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Ongoing Projects Portfolio</h2>
                <p className="text-xs text-slate-500">Track lifecycle from tender creation to milestone authorizations.</p>
              </div>
            </div>
            <Link href="/company/ongoing" className="text-xs font-bold text-teal-600 hover:underline">
              View All ({ongoingExecutionProjects.length}) →
            </Link>
          </div>

          {ongoingExecutionProjects.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6 text-xs text-slate-500">
              No ongoing locked projects. Lock an available project above to start.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ongoingExecutionProjects.map((project) => (
                <ProjectStatusCard
                  key={project.id}
                  project={project}
                  userRole="CORPORATE"
                  onOpenStatusModal={() => setStatusModalProject(project)}
                />
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: COMPLETED PROJECTS */}
        <div id="completed-projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Completed & Verified Projects</h2>
                <p className="text-xs text-slate-500">100% disbursed funds, verified impact, and MCA Schedule VII compliance reports.</p>
              </div>
            </div>
            <Link href="/company/completed" className="text-xs font-bold text-emerald-600 hover:underline">
              View All ({completedProjects.length}) →
            </Link>
          </div>

          {completedProjects.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 p-6 text-xs text-slate-500">
              No completed projects yet. Projects move here after final 40% disbursement.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedProjects.map((project) => (
                <div key={project.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {project.project_code}
                    </span>
                    <StatusBadge status="COMPLETED" size="sm" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{project.title}</h3>
                  <p className="text-xs text-slate-600">{project.beneficiaries} beneficiaries reached in {project.location}.</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-mono font-bold text-slate-800">
                      ₹{(project.contract_value || project.estimated_budget).toLocaleString()}
                    </span>
                    <Link
                      href={`/company/reports/${project.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>View Impact Report</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CORE STATUS POPUP MODAL */}
      <ProjectStatusModal
        project={statusModalProject}
        isOpen={!!statusModalProject}
        onClose={() => setStatusModalProject(null)}
        onRefresh={loadProjects}
      />

      {/* LOCK PROJECT CONFIRMATION MODAL */}
      <CompanyLockModal
        project={lockModalProject}
        isOpen={!!lockModalProject}
        onClose={() => setLockModalProject(null)}
        onSuccess={loadProjects}
      />

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
