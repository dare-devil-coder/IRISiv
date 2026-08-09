'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject } from '@/types';
import { ArrowLeft, ArrowRight, Filter } from 'lucide-react';

export default function CorporateProjectsPortfolioPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/projects?role=CORPORATE')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProjects(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL'
    ? projects
    : projects.filter((p) => p.status === filter || (filter === 'ACTIVE' && ['CSR_APPROVED', 'PUBLISHED', 'PROPOSALS_OPEN', 'CONTRACTED', 'ADVANCE_PAID', 'IN_PROGRESS'].includes(p.status)));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <Link
          href="/corporate/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Corporate Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">CSR Funded Project Portfolio</h1>
            <p className="text-xs text-slate-600 mt-1">Complete portfolio listing across all lifecycle stages</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-teal-600 cursor-pointer shadow-sm [color-scheme:light]"
            >
              <option value="ALL">All Projects ({projects.length})</option>
              <option value="ACTIVE">Active Pipeline</option>
              <option value="SUBMITTED">Awaiting Approval</option>
              <option value="PROPOSALS_OPEN">Proposals Open</option>
              <option value="IN_PROGRESS">In Execution</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading portfolio projects...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No projects found for the selected filter.</div>
          ) : (
            <div className="divide-y divide-slate-200 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4 font-bold">Project Code</th>
                    <th className="p-4 font-bold">Title</th>
                    <th className="p-4 font-bold">NGO Partner</th>
                    <th className="p-4 font-bold">Executing Business</th>
                    <th className="p-4 font-bold">Budget</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-teal-700">{p.project_code}</td>
                      <td className="p-4 font-semibold text-slate-900">{p.title}</td>
                      <td className="p-4 text-slate-700 font-medium">{p.ngo_organization?.name || 'Shiksha Foundation'}</td>
                      <td className="p-4 text-slate-700 font-medium">{p.business_organization?.name || 'Pending Selection'}</td>
                      <td className="p-4 font-mono font-bold text-slate-900">
                        ₹{(p.contract_value || p.estimated_budget).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/corporate/projects/${p.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                        >
                          <span>Manage</span>
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
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
