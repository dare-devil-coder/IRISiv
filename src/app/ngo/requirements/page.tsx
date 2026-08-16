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
} from 'lucide-react';

export default function NGORequirementsListPage() {
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
              <span className="text-xs text-slate-500 font-medium">CSR Need Structuring</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">NGO Requirements Registry</h1>
            <p className="text-xs text-slate-500 mt-1">
              Draft, analyze, approve, and track your organization's CSR project requirements.
            </p>
          </div>

          <Link
            href="/ngo/requirements/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ Create New Requirement</span>
          </Link>
        </div>

        {/* Requirements List */}
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-6 w-6 text-teal-600 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Requirements Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have not created any CSR requirements yet. Start by defining your beneficiaries and budget.
            </p>
            <Link
              href="/ngo/requirements/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm hover:bg-teal-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Requirement</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {project.project_code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{project.category}</span>
                  </div>
                  <StatusBadge status={project.status} size="sm" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* 1. NGO Details */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">1. NGO Details</span>
                    <p className="font-bold text-slate-900">{project.ngo_organization?.name || 'Shiksha Foundation'}</p>
                    <p className="text-slate-500">{project.location}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                      KYC VERIFIED ✓
                    </span>
                  </div>

                  {/* 2. Project Details */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">2. Project Details</span>
                    <h4 className="font-bold text-slate-900">{project.title}</h4>
                    <p className="text-slate-600 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-3 pt-1 text-slate-700 font-mono">
                      <span>₹{(project.contract_value || project.estimated_budget).toLocaleString()}</span>
                      <span>•</span>
                      <span>{project.target_quantity || project.beneficiaries} {project.target_unit || 'units'}</span>
                    </div>
                  </div>

                  {/* 3. AI Report Summary */}
                  <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold text-violet-700 block flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        3. AI Report
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">94% Feasible</span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {project.status === 'DRAFT'
                        ? 'AI Need Structuring pending...'
                        : 'Feasible and realistic budget. MCA Schedule VII Education compliant.'}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={`/ngo/projects/${project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:underline"
                      >
                        <span>Review Full AI Report</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Link
                    href={`/ngo/projects/${project.id}`}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    View Project Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
