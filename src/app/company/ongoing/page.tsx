'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProjectStatusModal } from '@/components/shared/ProjectStatusModal';
import {
  Briefcase,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Plus,
  RotateCcw,
  Eye,
  FileText,
  Loader2,
} from 'lucide-react';

export default function CompanyOngoingProjectsPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModalProject, setStatusModalProject] = useState<CSRProject | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?role=CORPORATE');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Filter ongoing locked projects (not completed or submitted)
        const ongoing = json.data.filter(
          (p: CSRProject) =>
            ['CORPORATE_INTERESTED', 'TENDER_OPEN', 'TENDER_CLOSED', 'AI_EVALUATED', 'BUSINESS_SELECTED', 'CONTRACTED', 'ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'MANUAL_REVIEW'].includes(p.status)
        );
        setProjects(ongoing);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                COMPANY PORTAL
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">Ongoing CSR Operations</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Ongoing Projects Portfolio</h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage locked CSR initiatives across tender creation, vendor selection, and 20/40/40 payments.
            </p>
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
              <span>Create Tender</span>
            </Link>
          </div>
        </div>

        {/* Project Cards */}
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
              <Briefcase className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Ongoing Projects</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't locked any projects yet. Discover vetted NGO requirements to begin.
            </p>
            <Link
              href="/company/new-projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
            >
              <span>Browse New Projects</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => {
              const contractVal = project.contract_value || project.estimated_budget;
              const hasTender = !!project.tender_id || ['TENDER_OPEN', 'TENDER_CLOSED', 'AI_EVALUATED', 'BUSINESS_SELECTED', 'CONTRACTED', 'ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID'].includes(project.status);
              const selectedBusiness = project.business_organization?.name || (project.status === 'CORPORATE_INTERESTED' ? 'None (Tender Pending)' : 'GreenGrow Agro & Supplies');

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                        {project.project_code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{project.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={project.status} size="md" />
                    </div>
                  </div>

                  {/* Operational Status Matrix */}
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">NGO Partner</span>
                      <p className="font-bold text-slate-800">{project.ngo_organization?.name || 'Shiksha Foundation'}</p>
                      <p className="text-[11px] text-slate-500">{project.location}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Tender Status</span>
                      <p className="font-bold text-slate-800">
                        {hasTender ? 'Active / Released' : 'Not Created'}
                      </p>
                      <span className="text-[10px] text-indigo-600 font-medium">
                        {hasTender ? 'Quotations evaluated' : 'Needs action'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Selected Vendor</span>
                      <p className="font-bold text-slate-800 line-clamp-1">{selectedBusiness}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Domain: {project.category}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Payment State</span>
                      <p className="font-bold text-slate-800 font-mono">
                        {project.status === 'ADVANCE_20_PAID'
                          ? '20% Paid'
                          : project.status === 'MILESTONE_40_PAID'
                          ? '60% Paid (20+40)'
                          : project.status === 'FINAL_40_PAID' || project.status === 'COMPLETED'
                          ? '100% Paid'
                          : '0% Advance Pending'}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-mono">₹{contractVal.toLocaleString()}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Delivery Status</span>
                      <p className="font-bold text-slate-800">
                        {['FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(project.status)
                          ? 'Delivered ✓'
                          : 'In Execution'}
                      </p>
                      <p className="text-[10px] text-slate-500">{project.target_quantity || 500} units</p>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                      <span className="text-[10px] font-mono text-indigo-700 uppercase font-bold block">Next Action</span>
                      <p className="font-bold text-indigo-950">
                        {project.status === 'CORPORATE_INTERESTED'
                          ? 'Open Tender'
                          : project.status === 'TENDER_CLOSED' || project.status === 'AI_EVALUATED'
                          ? 'Select Business'
                          : project.status === 'BUSINESS_SELECTED' || project.status === 'CONTRACTED'
                          ? 'Release 20%'
                          : project.status === 'FULFILLMENT_SUBMITTED'
                          ? 'Release 40%'
                          : project.status === 'NGO_CONFIRMED'
                          ? 'Release Final 40%'
                          : 'View Progress'}
                      </p>
                      <span className="text-[10px] text-indigo-600">Click View Status</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setStatusModalProject(project)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <Eye className="h-4 w-4" />
                      <span>VIEW STATUS</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CORE STATUS POPUP MODAL */}
      <ProjectStatusModal
        project={statusModalProject}
        isOpen={!!statusModalProject}
        onClose={() => setStatusModalProject(null)}
        onRefresh={loadProjects}
      />
    </div>
  );
}
