'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { Tender, TenderQuotation } from '@/types';
import {
  ArrowLeft,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Briefcase,
  Loader2,
  Award,
  IndianRupee,
  Star,
  Check,
} from 'lucide-react';

export default function CorporateTenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [selectedSuccess, setSelectedSuccess] = useState(false);

  const loadTender = async () => {
    try {
      const res = await fetch(`/api/tenders/${id}`);
      const json = await res.json();
      if (json.success) setTender(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTender();
  }, [id]);

  const handleSelectQuotation = async (quotationId: string) => {
    if (!confirm('Are you sure you want to select this quotation? This will establish a contract and move the project to CONTRACTED state.')) return;

    setSelectingId(quotationId);
    try {
      const res = await fetch(`/api/tenders/${id}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotation_id: quotationId,
          corporate_organization_id: 'org-corp-1',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedSuccess(true);
        await loadTender();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSelectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">Tender Not Found</p>
          <Link href="/corporate/dashboard" className="text-xs text-emerald-600 font-bold mt-2 inline-block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const quotations = tender.quotations || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <Link href="/corporate/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>

        {/* Header Card */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-emerald-700">{tender.tender_code}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${
                  tender.status === 'OPEN' ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {tender.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{tender.title}</h1>
            </div>

            {selectedSuccess && (
              <div className="px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Vendor Selected & Contract Established!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Budget</span>
              <span className="font-mono font-bold text-slate-900 text-sm">₹{tender.budget.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Required Quantity</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{tender.required_quantity} {tender.unit}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Max Timeline</span>
              <span className="font-semibold text-slate-900">{tender.delivery_timeline_days} days</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Quotations Received</span>
              <span className="font-bold text-indigo-700 text-sm">{quotations.length} Bids</span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">Minimum Technical Specifications</h3>
          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{tender.minimum_specifications}</p>
        </div>

        {/* AI Quotation Comparison Table */}
        <div className="rounded-2xl border border-violet-200 bg-white shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-violet-100 bg-violet-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-violet-600" />
                <h2 className="text-base font-bold text-slate-900">Featherless AI Quotation Scoring & Comparison Table</h2>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Every quotation is evaluated across 7 weighted factors by Featherless AI to eliminate bias and accelerate selection.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-800 border border-violet-200 shrink-0">
              7-Factor AI Evaluator
            </span>
          </div>

          {quotations.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              No quotations received yet for this tender.
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
                    <th className="p-3 font-bold">Business Vendor</th>
                    <th className="p-3 font-bold">Bid Amount</th>
                    <th className="p-3 font-bold">Timeline</th>
                    <th className="p-3 font-bold text-center">Price (15%)</th>
                    <th className="p-3 font-bold text-center">Specs (25%)</th>
                    <th className="p-3 font-bold text-center">Timeline (15%)</th>
                    <th className="p-3 font-bold text-center">Capacity (20%)</th>
                    <th className="p-3 font-bold text-center">Experience (15%)</th>
                    <th className="p-3 font-bold text-center">Feasibility (10%)</th>
                    <th className="p-3 font-bold text-center text-violet-900 bg-violet-50">Overall AI Score</th>
                    <th className="p-3 font-bold">AI Recommendation</th>
                    <th className="p-3 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {quotations.map((q) => {
                    const ev = q.evaluation;
                    const isSelected = q.status === 'SELECTED';
                    const overall = ev?.overall_score ?? q.requirement_match_pct ?? 0;

                    return (
                      <tr key={q.id} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-emerald-50/60' : ''}`}>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{q.business_organization?.name || 'Vendor'}</div>
                          <div className="text-[10px] text-slate-500">{q.capacity || 'Verified Business'}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">₹{q.bid_amount.toLocaleString()}</td>
                        <td className="p-3 font-mono">{q.delivery_timeline_days} days</td>

                        {/* Scores */}
                        <td className="p-3 text-center font-mono font-bold text-slate-800">{ev?.price_score ?? '-'}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800">{ev?.requirement_match_score ?? '-'}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800">{ev?.timeline_score ?? '-'}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800">{ev?.capacity_score ?? '-'}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800">{ev?.experience_score ?? '-'}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800">{ev?.feasibility_score ?? '-'}</td>

                        {/* Overall AI Score */}
                        <td className="p-3 text-center bg-violet-50/70">
                          <span className={`inline-flex items-center gap-1 font-mono font-black text-sm px-2.5 py-1 rounded-full ${
                            overall >= 88 ? 'bg-emerald-100 text-emerald-900' : overall >= 75 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'
                          }`}>
                            <Star className="h-3 w-3 fill-current text-amber-500" />
                            {overall}/100
                          </span>
                        </td>

                        {/* AI Recommendation */}
                        <td className="p-3 max-w-[200px]">
                          <span className={`text-[10px] font-bold block ${
                            ev?.recommendation?.includes('STRONG') ? 'text-emerald-800' : 'text-slate-700'
                          }`}>
                            {ev?.recommendation || 'AI Evaluated'}
                          </span>
                          <span className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{ev?.reasoning}</span>
                        </td>

                        {/* Action */}
                        <td className="p-3 text-right">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px]">
                              <Check className="h-3.5 w-3.5" /> Selected Vendor
                            </span>
                          ) : tender.status === 'BUSINESS_SELECTED' || tender.status === 'CLOSED' ? (
                            <span className="text-[10px] text-slate-400 font-mono">Not selected</span>
                          ) : (
                            <button
                              onClick={() => handleSelectQuotation(q.id)}
                              disabled={!!selectingId}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
                            >
                              {selectingId === q.id ? <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" /> : 'Select Vendor'}
                            </button>
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
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
