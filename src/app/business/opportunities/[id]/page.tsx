'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { AIAnalysisLoadingModal } from '@/components/shared/AIAnalysisLoadingModal';
import { ToastContainer, ToastMessage } from '@/components/shared/Toast';
import { CSRProject } from '@/types';
import { ArrowLeft, Briefcase, Sparkles, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

export default function BusinessProposalSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<CSRProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Storing numeric values as clean string state prevents unwanted leading zero artifacts (e.g. 056000 or 01)
  const [formData, setFormData] = useState({
    bid_amount: '50000',
    delivery_timeline_days: '14',
    capacity: 'Can deliver 500 kits within 14 days with quality certification',
    experience: 'Completed 15 rural school supply projects in Gujarat',
    description: 'We will supply high-quality, durable educational kits packaged into individual weather-resistant school bags.',
  });

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

  const handleNumberChange = (field: 'bid_amount' | 'delivery_timeline_days', rawValue: string) => {
    const cleaned = rawValue.replace(/^0+(?=\d)/, '');
    setFormData((prev) => ({ ...prev, [field]: cleaned }));
  };

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProject(json.data.project);
          if (json.data.project) {
            setFormData((prev) => ({
              ...prev,
              bid_amount: String(json.data.project.estimated_budget),
            }));
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setShowAIModal(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const res = await fetch(`/api/projects/${id}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bid_amount: Number(formData.bid_amount),
          delivery_timeline_days: Number(formData.delivery_timeline_days),
          business_organization_id: 'org-biz-1',
        }),
      });

      const json = await res.json();
      setShowAIModal(false);

      if (json.success) {
        const score = json.data.evaluation?.overall_score || 95;
        const rec = json.data.evaluation?.recommendation || 'STRONG CANDIDATE';
        addToast(
          'ai',
          'Proposal Evaluated by Featherless AI',
          `Bid score: ${score}/100 (${rec}). Redirecting to vendor portal...`
        );
        setTimeout(() => {
          router.push('/business/dashboard');
        }, 1500);
      } else {
        addToast('error', 'Submission Failed', json.error?.message || 'Proposal submission failed');
      }
    } catch {
      setShowAIModal(false);
      addToast('error', 'Network Error', 'Failed to connect to proposal API service.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar currentRole="BUSINESS" />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">Loading opportunity details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar currentRole="BUSINESS" />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">Opportunity not found.</div>
      </div>
    );
  }

  const bidNum = Number(formData.bid_amount) || 0;
  const daysNum = Number(formData.delivery_timeline_days) || 0;

  const today = new Date();
  const estimatedDateObj = new Date(today.getTime() + (daysNum * 24 * 60 * 60 * 1000));
  const estDateStr = estimatedDateObj.toISOString().split('T')[0];
  const targetDeadlineStr = project.deadline || '2026-09-30';
  const exceedsDeadline = estDateStr > targetDeadlineStr;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar currentRole="BUSINESS" />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <AIAnalysisLoadingModal
        isOpen={showAIModal}
        title="Featherless AI Bid Scoring in Progress"
        subtitle="Evaluating vendor proposal across Cost, Timeline, Capacity & Feasibility..."
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Opportunities Marketplace</span>
        </button>

        {/* Opportunity Requirement Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
              {project.project_code}
            </span>
            <span className="text-xs text-slate-500 font-mono">Category: {project.category}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{project.title}</h1>
          <p className="text-xs text-slate-600 leading-relaxed">{project.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Approved Budget:</span>
              <p className="font-bold text-emerald-700 text-sm mt-0.5">₹{project.estimated_budget.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Target Beneficiaries:</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{project.beneficiaries.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">NGO Required Deadline:</span>
              <p className="font-bold text-amber-700 text-xs mt-0.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-600" />
                {targetDeadlineStr}
              </p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Location:</span>
              <p className="font-semibold text-slate-800 text-xs mt-0.5">{project.location || 'Gujarat'}</p>
            </div>
          </div>
        </div>

        {/* Bidding Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-teal-600" />
              Submit Business Bid Proposal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your proposal will be automatically evaluated by Featherless AI for Cost, Timeline, Capacity, and Feasibility.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-700 font-semibold">Proposed Bid Amount (₹) *</label>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    ₹ {bidNum.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.bid_amount}
                  onChange={(e) => handleNumberChange('bid_amount', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-700 font-semibold">Delivery Timeline (Days) *</label>
                  <span className="text-[11px] font-mono text-teal-700 font-bold">
                    {daysNum} {daysNum === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.delivery_timeline_days}
                  onChange={(e) => handleNumberChange('delivery_timeline_days', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30"
                />

                {/* Estimated Completion Date & NGO Deadline Comparison */}
                <div className="mt-2 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Est. Completion Date:</span>
                    <span className="font-bold text-slate-900">{estDateStr}</span>
                  </div>
                  {exceedsDeadline ? (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-1.5 leading-tight">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 mt-0.5" />
                      <span>Note: Estimated completion ({estDateStr}) is past NGO deadline ({targetDeadlineStr}). Featherless AI will factor this into timeline scoring.</span>
                    </div>
                  ) : (
                    <div className="text-emerald-700 text-[11px] flex items-center gap-1 font-semibold">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                      <span>Within NGO Target Deadline ({targetDeadlineStr})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Vendor Execution Capacity & Inventory *</label>
              <input
                type="text"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Relevant Past Experience *</label>
              <input
                type="text"
                required
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Proposal Technical Description *</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30 leading-relaxed"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                {submitting ? <Sparkles className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                <span>Submit Proposal & Run AI Evaluation</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
