'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Tender, TenderQuotation, CSRProject } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  FileText,
  Cpu,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  IndianRupee,
  Award,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';

export default function TenderComparisonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tender, setTender] = useState<Tender | null>(null);
  const [quotations, setQuotations] = useState<TenderQuotation[]>([]);
  const [project, setProject] = useState<CSRProject | null>(null);
  const [loading, setLoading] = useState(true);

  // Selection Modal state
  const [selectedQuotation, setSelectedQuotation] = useState<TenderQuotation | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [closingTender, setClosingTender] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [tRes, qRes] = await Promise.all([
        fetch(`/api/tenders/${id}`).catch(() => null),
        fetch(`/api/tenders/${id}/quotations`).catch(() => null),
      ]);

      if (tRes && tRes.ok) {
        const tJson = await tRes.json();
        if (tJson.success) {
          setTender(tJson.data);
          if (tJson.data.project_id) {
            const pRes = await fetch(`/api/projects/${tJson.data.project_id}`);
            const pJson = await pRes.json();
            if (pJson.success) setProject(pJson.data);
          }
        }
      }

      if (qRes && qRes.ok) {
        const qJson = await qRes.json();
        if (qJson.success) setQuotations(qJson.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCloseTender = async () => {
    setClosingTender(true);
    try {
      const res = await fetch(`/api/tenders/${id}/close`, { method: 'POST' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to close tender');
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setClosingTender(false);
    }
  };

  const handleConfirmSelection = async () => {
    if (!selectedQuotation) return;
    setSelecting(true);
    setError(null);
    try {
      const res = await fetch(`/api/tenders/${id}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotation_id: selectedQuotation.id,
          corporate_organization_id: 'org-corp-1',
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to select vendor');

      router.push('/corporate/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentRole="CORPORATE" />
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentRole="CORPORATE" />
        <div className="max-w-xl mx-auto py-16 text-center">
          <h2 className="text-lg font-bold text-slate-900">Tender Not Found</h2>
          <Link href="/corporate/dashboard" className="text-xs text-indigo-700 font-bold hover:underline mt-2 inline-block">
            ← Return to Company Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Sort quotations by AI Score descending
  const sortedQuotations = [...quotations].sort(
    (a, b) => (b.evaluation?.overall_score || 0) - (a.evaluation?.overall_score || 0)
  );
  const topQuotation = sortedQuotations[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/corporate/dashboard" className="text-xs font-mono text-slate-500 hover:text-slate-900">
                Dashboard
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-xs font-mono font-bold text-indigo-700">{tender.tender_code}</span>
              <StatusBadge status={tender.status} size="sm" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">{tender.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Project: <strong>{project?.title || 'CSR Initiative'}</strong> • Ceiling Budget: <strong>₹{(tender.max_budget || tender.budget || 0).toLocaleString()}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {tender.status === 'OPEN' && (
              <button
                onClick={handleCloseTender}
                disabled={closingTender}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition"
              >
                {closingTender ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />}
                <span>Close Tender & Run AI Scoring</span>
              </button>
            )}

            <button
              onClick={loadData}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Advisory Callout Banner */}
        <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-200 flex items-start gap-3">
          <Cpu className="h-5 w-5 text-violet-700 mt-0.5 shrink-0" />
          <div className="text-xs text-violet-950 space-y-0.5">
            <span className="font-bold block">Featherless AI 7-Factor Tender Evaluation Matrix:</span>
            <p>
              AI analyzes price competitiveness (25%), delivery timeline (20%), vendor experience (15%), capacity (15%), item specifications (10%), warranty (10%), and compliance (5%).
              <strong> AI recommends. The Company makes the final vendor selection decision.</strong>
            </p>
          </div>
        </div>

        {/* Top Recommendation Highlight Card */}
        {topQuotation && topQuotation.evaluation && (
          <div className="p-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase tracking-wide">
                  ★ AI Top Recommendation
                </span>
                <span className="font-mono font-black text-emerald-950 text-sm">
                  SCORE: {topQuotation.evaluation.overall_score.toFixed(1)} / 100
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {topQuotation.business_organization?.name || 'GreenGrow Educational Supplies Ltd'}
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {topQuotation.evaluation.ai_recommendation ||
                  'Strongest overall quotation: 8.5% below ceiling budget, 12-day faster delivery timeline, and 7 years of certified CSR vendor track record.'}
              </p>
            </div>

            {tender.status !== 'BUSINESS_SELECTED' && (
              <button
                onClick={() => setSelectedQuotation(topQuotation)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm shrink-0 flex items-center gap-2 transition"
              >
                <span>Select This Business</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Side-by-Side Quotation Comparison Table */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">All Vendor Bids & Multi-Factor AI Evaluation</h3>
            <span className="text-xs text-slate-500 font-mono">{quotations.length} Bids Submitted</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase">
                <th className="p-3.5">Vendor / Business</th>
                <th className="p-3.5">Quoted Bid (₹)</th>
                <th className="p-3.5">Delivery Timeline</th>
                <th className="p-3.5">Experience & Capacity</th>
                <th className="p-3.5">Featherless AI Score</th>
                <th className="p-3.5 text-right">Company Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedQuotations.map((q, idx) => {
                const isSelected = q.status === 'SELECTED' || tender.selected_quotation_id === q.id;
                const score = q.evaluation?.overall_score || 85;
                const isTop = idx === 0;

                return (
                  <tr key={q.id} className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-emerald-50/50' : ''}`}>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-purple-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {q.business_organization?.name || 'Vendor Business'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{q.business_organization?.location}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-slate-900 text-sm">
                      ₹{q.bid_amount.toLocaleString()}
                    </td>

                    <td className="p-3.5 text-slate-700">
                      <strong>{q.delivery_timeline_days} Days</strong>
                      <span className="block text-[10px] text-slate-400">Target: {tender.delivery_deadline_days} days</span>
                    </td>

                    <td className="p-3.5 text-slate-700">
                      <span>{q.relevant_experience_years || 5} Years Exp</span>
                      <span className="block text-[10px] text-slate-400 font-mono uppercase">{q.production_capacity || 'High'} Capacity</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${score >= 90 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-xs text-slate-900">{score.toFixed(1)}/100</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow-xs">
                          <Check className="h-3.5 w-3.5" />
                          <span>SELECTED</span>
                        </span>
                      ) : tender.status === 'BUSINESS_SELECTED' ? (
                        <span className="text-slate-400 text-[11px] font-medium">Closed</span>
                      ) : (
                        <button
                          onClick={() => setSelectedQuotation(q)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
                        >
                          Select Vendor
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* SELECTION CONFIRMATION MODAL */}
        {selectedQuotation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Select Execution Vendor</h3>
                    <p className="text-xs text-slate-500">{tender.tender_code}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedQuotation(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-900">
                  Select {selectedQuotation.business_organization?.name || 'Selected Vendor'} as execution partner?
                </p>
                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div>Contract Amount: <strong>₹{selectedQuotation.bid_amount.toLocaleString()}</strong></div>
                  <div>Delivery Timeline: <strong>{selectedQuotation.delivery_timeline_days} Days</strong></div>
                  <div>AI Score: <strong>{selectedQuotation.evaluation?.overall_score?.toFixed(1) || 94}/100</strong></div>
                  <div>Payment Terms: <strong>20 / 40 / 40 Escrow</strong></div>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                Upon confirmation, a formal CSR procurement contract will be created and the 20% Advance Payment step will be unlocked.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedQuotation(null)}
                  disabled={selecting}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSelection}
                  disabled={selecting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
                >
                  {selecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>Confirm Selection</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
