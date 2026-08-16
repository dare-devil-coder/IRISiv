'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  CheckCircle2,
  FileText,
  Download,
  IndianRupee,
  Building2,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Loader2,
  Eye,
} from 'lucide-react';

export default function CompanyCompletedProjectsPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?role=CORPORATE');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const completed = json.data.filter((p: CSRProject) => p.status === 'COMPLETED');
        setProjects(completed);
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
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                COMPANY PORTAL
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">Audited CSR Impact</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Completed & Verified Projects</h1>
            <p className="text-xs text-slate-500 mt-1">
              100% disbursed funds, verified beneficiary outcomes, and MCA Schedule VII compliant AI impact certificates.
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

        {/* List of Completed Projects */}
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Completed Projects Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Projects move here once the final 40% payment is disbursed and the AI Impact Report is generated.
            </p>
            <Link
              href="/company/ongoing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
            >
              <span>View Ongoing Projects</span>
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
                  <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/40">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300">
                        {project.project_code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{project.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                        COMPLETED & AUDITED ✓
                      </span>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">NGO Partner</span>
                      <p className="font-bold text-slate-800">{project.ngo_organization?.name || 'Shiksha Foundation'}</p>
                      <p className="text-slate-500">{project.location}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Executed By Vendor</span>
                      <p className="font-bold text-slate-800">{project.business_organization?.name || 'GreenGrow Agro & Supplies'}</p>
                      <p className="text-slate-500">100% Quality Confirmed</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Total CSR Disbursed</span>
                      <p className="font-bold text-slate-900 font-mono text-sm">₹{contractVal.toLocaleString()}</p>
                      <p className="text-emerald-700 font-medium">20% + 40% + 40% (100%)</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Impact Delivered</span>
                      <p className="font-bold text-slate-900">{project.beneficiaries_impacted || project.beneficiaries} Beneficiaries</p>
                      <p className="text-slate-500">{project.target_quantity || 500} {project.target_unit || 'units'} deployed</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <Link
                      href={`/company/reports/${project.id}`}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View AI Impact Report</span>
                    </Link>

                    <Link
                      href={`/company/reviews?projectId=${project.id}`}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-xs transition"
                    >
                      Submit / View Reviews
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
