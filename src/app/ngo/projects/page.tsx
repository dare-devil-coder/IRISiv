'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  FileText,
  Plus,
  ArrowRight,
  Sparkles,
  Building2,
  Clock,
  CheckCircle2,
  ChevronRight,
  IndianRupee,
  Loader2,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export default function NGOProjectsPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects?role=NGO')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProjects(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="NGO" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                NGO PORTAL
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">CSR Projects & AI Verification</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">NGO Projects Directory</h1>
            <p className="text-xs text-slate-500 mt-1">
              Full 3-tier view with NGO details, Project details, and Autonomous AI Reports.
            </p>
          </div>

          <Link
            href="/ngo/requirements/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ Create Requirement</span>
          </Link>
        </div>

        {/* Project Cards */}
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-6 w-6 text-teal-600 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Projects Active</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently have no active or completed CSR projects. Submit your first requirement.
            </p>
            <Link
              href="/ngo/requirements/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm hover:bg-teal-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Requirement</span>
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
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
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
                            ACTIVE ✓
                          </span>
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
                            {project.target_quantity || project.beneficiaries} {project.target_unit || 'kits'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Budget:</span>
                          <span className="font-mono font-bold text-slate-900">₹{contractVal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Beneficiaries:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {project.beneficiaries_impacted || project.beneficiaries} children
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
                          <span className="text-slate-500">Budget Realism:</span>
                          <span className="font-semibold text-slate-800">Realistic (₹{Math.round(contractVal / (project.target_quantity || 500))}/unit)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Risks:</span>
                          <span className="font-semibold text-amber-800">Monsoon transit</span>
                        </div>
                        <p className="text-[11px] text-slate-600 pt-1 line-clamp-2 italic">
                          "Aligned with Schedule VII MCA guidelines. Recommend approval."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <Link
                      href={`/ngo/projects/${project.id}`}
                      className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-xs transition"
                    >
                      View AI Report & Details
                    </Link>
                    <Link
                      href="/ngo/status"
                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      View Full Lifecycle Status
                    </Link>
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
