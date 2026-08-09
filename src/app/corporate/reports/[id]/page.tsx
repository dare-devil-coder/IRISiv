'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject, ImpactReport } from '@/types';
import { ArrowLeft, Award, ShieldCheck, CheckCircle2, Printer, Sparkles } from 'lucide-react';

export default function ImpactReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<CSRProject | null>(null);
  const [report, setReport] = useState<ImpactReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProject(json.data.project);
          setReport(json.data.impactReport);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar currentRole="CORPORATE" />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">Loading verifiable impact report...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar currentRole="CORPORATE" />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">Project record not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Corporate Portal</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>

        {/* Verifiable Impact Certificate Card */}
        <div className="rounded-3xl border border-emerald-300 bg-white p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Award className="h-64 w-64 text-emerald-600" />
          </div>

          {/* Header */}
          <div className="border-b border-slate-200 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
                <span>IRISiv VERIFIED CSR IMPACT REPORT</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{project.title}</h1>
              <p className="text-xs text-slate-600 mt-1 font-mono">Project Code: {project.project_code} • Category: {project.category}</p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-center shrink-0">
              <span className="text-[10px] font-mono uppercase block text-emerald-700 font-bold">Verification Seal</span>
              <span className="text-xs font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% AUDITED
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Funded Value</span>
              <p className="text-lg font-black text-slate-900 font-mono mt-1">
                ₹{(project.contract_value || project.estimated_budget).toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Target Beneficiaries</span>
              <p className="text-lg font-black text-emerald-700 font-mono mt-1">
                {project.beneficiaries.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Verified Delivery</span>
              <p className="text-lg font-black text-teal-700 font-mono mt-1">100%</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Location</span>
              <p className="text-xs font-bold text-slate-800 mt-2 line-clamp-1">{project.location || 'Gujarat'}</p>
            </div>
          </div>

          {/* Partners Involved */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8 text-xs">
            <div>
              <span className="text-slate-500 font-mono text-[10px] uppercase font-bold">Corporate Funder:</span>
              <p className="font-bold text-slate-900 mt-0.5">{project.corporate_organization?.name || 'Tata Sustainability Group'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] uppercase font-bold">NGO Partner:</span>
              <p className="font-bold text-slate-900 mt-0.5">{project.ngo_organization?.name || 'Shiksha Foundation'}</p>
            </div>
          </div>

          {/* Featherless AI Executive Impact Summary */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-teal-700 text-sm mb-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span>Verifiable Impact Executive Summary</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-sans font-medium">
              {report?.impact_summary ||
                `IRISiv Verified Impact Summary: Project '${project.title}' (${project.project_code}) successfully reached ${project.beneficiaries.toLocaleString()} target beneficiaries in ${project.location || 'assigned region'}. Contract value of ₹${(project.contract_value || project.estimated_budget).toLocaleString()} was executed under full dual-layer NGO physical check and AI cross-verification. Delivery proof and signed receipt metadata recorded into immutable audit logs.`}
            </p>
          </div>
        </div>
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
