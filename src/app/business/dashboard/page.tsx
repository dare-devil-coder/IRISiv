'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject, Tender } from '@/types';
import {
  Briefcase,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  PackageCheck,
  Clock,
  Building2,
  Award,
} from 'lucide-react';

export default function BusinessDashboard() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tenders' | 'my_projects'>('tenders');

  const loadData = async () => {
    try {
      const [tRes, pRes] = await Promise.all([
        fetch('/api/tenders?status=OPEN'),
        fetch('/api/projects?role=BUSINESS&orgId=org-biz-1'),
      ]);
      const tJson = await tRes.json();
      const pJson = await pRes.json();
      if (tJson.success) setTenders(tJson.data);
      if (pJson.success) setProjects(pJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeProjects = projects.filter((p) =>
    ['CONTRACTED', 'ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMED'].includes(p.status)
  );
  const pendingFulfillment = projects.filter((p) => ['ADVANCE_20_PAID', 'IN_PROGRESS'].includes(p.status));
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Business Vendor Portal</h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                TechSolutions India Pvt Ltd
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Browse open CSR procurement tenders, submit blind quotations, and upload fulfillment proof for 20/40/40 milestone payments.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Open CSR Tenders</span>
            <div className="text-2xl font-black text-amber-800 font-mono mt-1">{tenders.length}</div>
            <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Accepting bids</span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Active Contracts</span>
            <div className="text-2xl font-black text-indigo-700 font-mono mt-1">{activeProjects.length}</div>
            <span className="text-[11px] text-indigo-700 font-semibold mt-1 block">In execution</span>
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm ${pendingFulfillment.length > 0 ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
            <span className="text-xs text-amber-900 font-mono font-bold uppercase">Fulfillment Proof Due</span>
            <div className="text-2xl font-black text-amber-900 font-mono mt-1">{pendingFulfillment.length}</div>
            <span className="text-[11px] text-amber-800 font-bold mt-1 block">Needs evidence upload</span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Completed Contracts</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{completedProjects.length}</div>
            <span className="text-[11px] text-slate-500 mt-1 block font-medium">100% paid</span>
          </div>
        </div>

        {/* Action Needed Alert */}
        {pendingFulfillment.length > 0 && (
          <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <PackageCheck className="h-6 w-6 text-amber-600 animate-bounce shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-amber-900">Upload Fulfillment Proof for {pendingFulfillment[0].project_code}</h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Submit delivery receipt and evidence to trigger your 40% fulfillment milestone payment (₹{Math.round((pendingFulfillment[0].contract_value || pendingFulfillment[0].estimated_budget) * 0.4).toLocaleString()}).
                </p>
              </div>
            </div>
            <Link
              href={`/business/projects/${pendingFulfillment[0].id}/fulfillment`}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition shadow-sm"
            >
              Upload Proof Now
            </Link>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('tenders')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'tenders' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Open Tenders Marketplace ({tenders.length})
          </button>
          <button
            onClick={() => setActiveTab('my_projects')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'my_projects' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Active Contracts & 20/40/40 Ledger ({projects.length})
          </button>
        </div>

        {/* Tab 1: Open Tenders Marketplace */}
        {activeTab === 'tenders' && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-600" />
                Live CSR Tenders Available for Bidding
              </h2>
              <span className="text-xs font-mono font-bold text-slate-500">Blind Quotation Process</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 animate-pulse">Loading open tenders...</div>
            ) : tenders.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No open tenders available right now.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                {tenders.map((t) => (
                  <div key={t.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-700">{t.tender_code}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-50 text-amber-900 border border-amber-300">
                        OPEN
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{t.title}</h3>

                    <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-sans">Budget</span>
                        <span className="font-bold text-slate-900">₹{t.budget.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-sans">Quantity</span>
                        <span className="font-bold text-slate-900">{t.required_quantity} {t.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-sans">Max Timeline</span>
                        <span className="font-bold text-slate-900">{t.delivery_timeline_days} days</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{t.minimum_specifications}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">Closing: {t.closing_date ? t.closing_date.split('T')[0] : 'Open'}</span>
                      <Link
                        href={`/business/tenders/${t.id}/quotation`}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
                      >
                        <span>Submit Quotation</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Contracts & 20/40/40 Ledger */}
        {activeTab === 'my_projects' && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                Contracted CSR Projects & 20/40/40 Payments
              </h2>
            </div>

            {projects.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No active contracts yet. Submit a quotation for an open tender above.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-4 font-bold">Code</th>
                      <th className="p-4 font-bold">Project Title</th>
                      <th className="p-4 font-bold hidden sm:table-cell">Contract Value</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold hidden md:table-cell">20% Advance</th>
                      <th className="p-4 font-bold hidden md:table-cell">40% Milestone</th>
                      <th className="p-4 font-bold hidden md:table-cell">40% Final</th>
                      <th className="p-4 text-right font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {projects.map((p) => {
                      const contractVal = p.contract_value || p.estimated_budget;
                      const isAdvPaid = ['ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(p.status);
                      const isMilestonePaid = ['MILESTONE_40_PAID', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(p.status);
                      const isFinalPaid = ['FINAL_40_PAID', 'COMPLETED'].includes(p.status);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-indigo-700">{p.project_code}</td>
                          <td className="p-4 font-semibold text-slate-900 max-w-[200px]">
                            <span className="line-clamp-1">{p.title}</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-900 hidden sm:table-cell">₹{contractVal.toLocaleString()}</td>
                          <td className="p-4"><StatusBadge status={p.status} size="sm" /></td>

                          <td className="p-4 hidden md:table-cell">
                            <span className={`font-mono text-[11px] font-bold ${isAdvPaid ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {isAdvPaid ? `✓ ₹${Math.round(contractVal * 0.2).toLocaleString()}` : 'Pending'}
                            </span>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <span className={`font-mono text-[11px] font-bold ${isMilestonePaid ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {isMilestonePaid ? `✓ ₹${Math.round(contractVal * 0.4).toLocaleString()}` : 'Pending'}
                            </span>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <span className={`font-mono text-[11px] font-bold ${isFinalPaid ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {isFinalPaid ? `✓ ₹${Math.round(contractVal * 0.4).toLocaleString()}` : 'Pending'}
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            {['ADVANCE_20_PAID', 'IN_PROGRESS'].includes(p.status) ? (
                              <Link
                                href={`/business/projects/${p.id}/fulfillment`}
                                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition"
                              >
                                Upload Proof
                              </Link>
                            ) : (
                              <Link href={`/ngo/projects/${p.id}`} className="text-xs font-bold text-indigo-700 hover:text-indigo-900">
                                View Details
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
