'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { Layers, RotateCcw, PackageCheck, CheckCircle2 } from 'lucide-react';

export default function BusinessStatusPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?role=BUSINESS');
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="h-6 w-6 text-purple-600" />
              Vendor Tender & Contract Status Explorer
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Detailed tracking of quotation evaluation, contract execution, delivery document verification, and 20/40/40 disbursements
            </p>
          </div>

          <button
            onClick={loadProjects}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase">
                <th className="p-3.5">Contract / Tender</th>
                <th className="p-3.5">Sponsor & NGO</th>
                <th className="p-3.5">Contract Value</th>
                <th className="p-3.5">Workflow Status</th>
                <th className="p-3.5">Disbursed (20/40/40)</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const contractVal = p.contract_value || p.estimated_budget;
                const isAdvPaid = ['ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(p.status);
                const isMilestonePaid = ['MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(p.status);
                const isFinalPaid = ['FINAL_40_PAID', 'COMPLETED'].includes(p.status);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{p.title}</span>
                      <span className="text-[10px] font-mono text-purple-700">{p.project_code}</span>
                    </td>

                    <td className="p-3.5 text-slate-700">
                      <span className="block font-semibold">{p.corporate_organization?.name || 'Corporate Sponsor'}</span>
                      <span className="text-[10px] text-slate-400">NGO: {p.ngo_organization?.name || 'NGO Partner'}</span>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-slate-900 text-sm">
                      ₹{contractVal.toLocaleString()}
                    </td>

                    <td className="p-3.5">
                      <StatusBadge status={p.status} size="sm" />
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <span className={isAdvPaid ? 'text-teal-700 font-bold' : 'text-slate-400'}>20% {isAdvPaid ? '✓' : '○'}</span>
                        <span className="text-slate-300">/</span>
                        <span className={isMilestonePaid ? 'text-indigo-700 font-bold' : 'text-slate-400'}>40% {isMilestonePaid ? '✓' : '○'}</span>
                        <span className="text-slate-300">/</span>
                        <span className={isFinalPaid ? 'text-emerald-700 font-bold' : 'text-slate-400'}>40% {isFinalPaid ? '✓' : '○'}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <Link
                        href={`/business/projects/${p.id}/fulfillment`}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1"
                      >
                        <PackageCheck className="h-3.5 w-3.5" />
                        <span>View Contract</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
