'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { AIEvaluationCard } from '@/components/shared/AIEvaluationCard';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { AIAnalysisLoadingModal } from '@/components/shared/AIAnalysisLoadingModal';
import { ToastContainer, ToastMessage } from '@/components/shared/Toast';
import { CSRProject, Proposal } from '@/types';
import { ArrowLeft, Sparkles, Award, CheckCircle2, Sliders, Info } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';

export default function CorporateProposalComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<CSRProject | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const projRes = await fetch(`/api/projects/${id}`);
      const projJson = await projRes.json();
      if (projJson.success) {
        setProject(projJson.data.project);
        setProposals(projJson.data.proposals || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSelectBusiness = async (proposalId: string, bizName: string) => {
    setSelecting(true);
    setShowAIModal(true);

    try {
      await new Promise((r) => setTimeout(r, 1600));

      const res = await fetch(`/api/proposals/${proposalId}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corporate_organization_id: 'org-corp-1' }),
      });

      const json = await res.json();
      setShowAIModal(false);

      if (json.success) {
        addToast(
          'success',
          'Vendor Selected & Contract Initialized',
          `${bizName} has been contracted! Standard 30% Advance + 70% Final terms set.`
        );
        setTimeout(() => {
          router.push(`/corporate/projects/${id}`);
        }, 1200);
      } else {
        addToast('error', 'Selection Failed', json.error?.message || 'Selection failed');
      }
    } catch {
      setShowAIModal(false);
      addToast('error', 'Network Error', 'Failed to connect to selection endpoint.');
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar currentRole="CORPORATE" />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">Loading proposal matrix...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar currentRole="CORPORATE" />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <AIAnalysisLoadingModal
        isOpen={showAIModal}
        title="Establishing Contract State & Selecting Vendor"
        subtitle="Executing multi-party state machine transition & closing candidate bidding pool..."
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Project Details</span>
        </button>

        {/* Header Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-teal-700 font-mono font-bold">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>Featherless AI Proposal Scoring Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Vendor Proposal Bids Matrix — {project?.project_code}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Compare vendor bid amounts, delivery timelines, capacity, and AI multi-criteria scores to select winning vendor.
          </p>
        </div>

        {/* Formal AI Evaluation Parameters & Mathematical Rules Specification Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Sliders className="h-4 w-4 text-teal-600" />
              Formal AI Evaluation Parameters & Scoring Formula Matrix
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-bold">
              Qwen-2.5-72B Rules
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-slate-700 font-mono">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Cost (Weight: 30%)</span>
              <p className="text-xs font-bold text-emerald-700 mt-1">Bid vs Budget Ratio</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Timeline (Weight: 25%)</span>
              <p className="text-xs font-bold text-teal-700 mt-1">Days vs Deadline</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Capacity (Weight: 20%)</span>
              <p className="text-xs font-bold text-slate-900 mt-1">Units/Day Output</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Experience (Weight: 15%)</span>
              <p className="text-xs font-bold text-slate-900 mt-1">Regional Track Record</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Feasibility (Weight: 10%)</span>
              <p className="text-xs font-bold text-slate-900 mt-1">Risk Density Index</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-slate-700 text-[11px] font-mono leading-relaxed">
            <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong>Formula: </strong> Total Score = 0.30(Cost) + 0.25(Timeline) + 0.20(Capacity) + 0.15(Experience) + 0.10(Feasibility).
              <span className="ml-2 text-emerald-700 font-bold">Score &ge; 85: STRONG CANDIDATE</span> |
              <span className="ml-2 text-amber-800 font-bold">70 - 84: ACCEPTABLE</span> |
              <span className="ml-2 text-rose-700 font-bold">&lt; 70: HIGH RISK</span>
            </div>
          </div>
        </div>

        {/* Side-by-side Proposal Comparison Cards */}
        {proposals.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-2xl border border-slate-200 bg-white">
            No business proposals submitted for this project yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposals.map((prop) => {
              const isSelected = prop.status === 'SELECTED';
              const isRecommended = prop.evaluation?.overall_score && prop.evaluation.overall_score >= 88;

              return (
                <div
                  key={prop.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between backdrop-blur-sm transition-all shadow-sm ${
                    isSelected
                      ? 'border-emerald-500 bg-white ring-1 ring-emerald-500'
                      : isRecommended
                      ? 'border-teal-400 bg-white ring-1 ring-teal-400/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Banner */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {prop.business_organization?.name || 'Business Vendor'}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500">
                          Submitted {formatDate(prop.submitted_at)}
                        </span>
                      </div>
                      {isRecommended && (
                        <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-teal-600" /> AI Recommended
                        </span>
                      )}
                    </div>

                    {/* Key Proposal Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 font-mono text-[10px] uppercase font-bold">Bid Amount</span>
                        <p className="font-bold text-slate-900 font-mono text-sm mt-0.5">
                          ₹{prop.bid_amount.toLocaleString()}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 font-mono text-[10px] uppercase font-bold">Timeline</span>
                        <p className="font-bold text-teal-800 font-mono text-sm mt-0.5">
                          {prop.delivery_timeline_days} Days
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-800">Proposal Description:</span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{prop.description}</p>
                    </div>

                    {/* AI Evaluation Output Component */}
                    <AIEvaluationCard evaluation={prop.evaluation} />
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-slate-200 mt-6 flex justify-end">
                    {isSelected ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Selected Vendor
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handleSelectBusiness(prop.id, prop.business_organization?.name || 'Business')
                        }
                        disabled={selecting}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        Select Vendor & Create Contract
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
