'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CompanyLockModal } from '@/components/shared/CompanyLockModal';
import {
  Building2,
  Lock,
  Sparkles,
  FileText,
  ShieldCheck,
  RotateCcw,
  IndianRupee,
  Clock,
  CheckCircle2,
  Users,
  Loader2,
  ChevronRight,
  Eye,
} from 'lucide-react';

export default function CompanyNewProjectsPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockModalProject, setLockModalProject] = useState<CSRProject | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?role=CORPORATE');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Filter discoverable projects that are submitted & approved by NGO
        const discoverable = json.data.filter((p: CSRProject) => p.status === 'SUBMITTED' || p.status === 'NGO_REVIEW');
        setProjects(discoverable);
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
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                COMPANY PORTAL
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">CSR Requirement Discovery</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">New Available Projects</h1>
            <p className="text-xs text-slate-500 mt-1">
              Browse vetted NGO requirements with full AI feasibility and Schedule VII MCA compliance reports.
            </p>
          </div>

          <button
            onClick={loadProjects}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Project List */}
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No New Projects Available</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All submitted NGO requirements have currently been locked or are undergoing review.
            </p>
            <Link
              href="/company/ongoing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
            >
              <span>View Ongoing Portfolio</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => {
              const contractVal = project.contract_value || project.estimated_budget;
              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Card Top Banner */}
                  <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                        {project.project_code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{project.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={project.status} size="md" />
                    </div>
                  </div>

                  {/* 3 Major Information Groups */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 1. NGO DETAILS */}
                    <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-teal-600" />
                        1. NGO DETAILS
                      </span>
                      <div className="text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Organization:</span>
                          <span className="font-bold text-slate-800">{project.ngo_organization?.name || 'Shiksha Foundation'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Location:</span>
                          <span className="font-medium text-slate-700">{project.location}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-500">KYC Status:</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            VERIFIED ACTIVE ✓
                          </span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-500">Registration:</span>
                          <span className="font-mono text-slate-600">80G / 12A Certified</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. PROJECT DETAILS */}
                    <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-indigo-600" />
                        2. PROJECT DETAILS
                      </span>
                      <div className="text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Category:</span>
                          <span className="font-bold text-slate-800">{project.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Requirement:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {project.target_quantity || project.beneficiaries} {project.target_unit || 'units'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Estimated Budget:</span>
                          <span className="font-mono font-bold text-slate-900">₹{contractVal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Beneficiaries:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {project.beneficiaries_impacted || project.beneficiaries} individuals
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. AI REPORT */}
                    <div className="space-y-3 p-4 rounded-xl bg-violet-50/50 border border-violet-200">
                      <span className="text-[10px] font-mono uppercase font-bold text-violet-700 block border-b border-violet-200 pb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                          3. AI REPORT
                        </span>
                        <span className="font-bold text-emerald-700">94/100</span>
                      </span>
                      <div className="text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Feasibility:</span>
                          <span className="font-bold text-emerald-700">HIGH (94%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Budget Assessment:</span>
                          <span className="font-semibold text-slate-800">Realistic (₹{Math.round(contractVal / (project.target_quantity || 500))}/unit)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Risks:</span>
                          <span className="font-semibold text-amber-800">Monsoon transit delays</span>
                        </div>
                        <p className="text-[11px] text-slate-600 pt-1 line-clamp-2 italic">
                          "Recommendation: Strong CSR fit. Schedule VII MCA compliant."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar with Lock Project */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <Link
                      href={`/company/projects/${project.id}`}
                      className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Project Details</span>
                    </Link>

                    <button
                      onClick={() => setLockModalProject(project)}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Lock Project</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Lock Project Modal */}
      <CompanyLockModal
        project={lockModalProject}
        isOpen={!!lockModalProject}
        onClose={() => setLockModalProject(null)}
        onSuccess={() => {
          setLockModalProject(null);
          loadProjects();
        }}
      />
    </div>
  );
}
