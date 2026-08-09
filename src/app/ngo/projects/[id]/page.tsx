'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProjectLifecycleTimeline } from '@/components/shared/ProjectLifecycleTimeline';
import { PaymentMilestoneTracker } from '@/components/shared/PaymentMilestoneTracker';
import { WhatHappensNext } from '@/components/shared/WhatHappensNext';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject, Fulfillment, NGOVerification, AIVerification, Payment, NGONeedAnalysis } from '@/types';
import {
  ArrowLeft,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  ShieldCheck,
  Briefcase,
  Loader2,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  PackageCheck,
} from 'lucide-react';

export default function NGOProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<CSRProject | null>(null);
  const [needAnalysis, setNeedAnalysis] = useState<NGONeedAnalysis | null>(null);
  const [delivery, setDelivery] = useState<Fulfillment | null>(null);
  const [ngoVerification, setNGOVerification] = useState<NGOVerification | null>(null);
  const [aiVerification, setAIVerification] = useState<AIVerification | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for NGO verification
  const [verForm, setVerForm] = useState({
    quantity_received: '',
    quality_acceptable: true,
    packaging_acceptable: true,
    delivered_on_time: true,
    invoice_reference: '',
    comments: '',
    has_issue: false,
    issue_description: '',
  });
  const [submittingVer, setSubmittingVer] = useState(false);
  const [analyzingNeed, setAnalyzingNeed] = useState(false);
  const [approvingNeed, setApprovingNeed] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const json = await res.json();
      if (json.success) {
        setProject(json.data);
        if (json.data.delivery) setDelivery(json.data.delivery);
        if (json.data.ngoVerification) setNGOVerification(json.data.ngoVerification);
        if (json.data.aiVerification) setAIVerification(json.data.aiVerification);
        if (json.data.payments) setPayments(json.data.payments);
        if (json.data.ai_need_analysis) setNeedAnalysis(json.data.ai_need_analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleRunAIAnalysis = async () => {
    setAnalyzingNeed(true);
    try {
      const res = await fetch(`/api/projects/${id}/need-analysis`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setNeedAnalysis(json.data);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingNeed(false);
    }
  };

  const handleApproveNeed = async () => {
    setApprovingNeed(true);
    try {
      const res = await fetch(`/api/projects/${id}/approve-need`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setApprovingNeed(false);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verForm.quantity_received) return;
    setSubmittingVer(true);
    try {
      const res = await fetch(`/api/projects/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_id: delivery?.id || '',
          ...verForm,
          quantity_received: Number(verForm.quantity_received),
        }),
      });
      const json = await res.json();
      if (json.success) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingVer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">Project Not Found</p>
          <Link href="/ngo/dashboard" className="text-xs text-teal-600 font-bold mt-2 inline-block">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const isFulfillmentPendingConfirmation = ['FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING'].includes(project.status) && !ngoVerification;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="NGO" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Breadcrumb */}
        <Link href="/ngo/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to NGO Dashboard
        </Link>

        {/* Header card */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-teal-700">{project.project_code}</span>
                <StatusBadge status={project.status} size="sm" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{project.title}</h1>
            </div>

            {project.status === 'DRAFT' && (
              <button
                onClick={handleRunAIAnalysis}
                disabled={analyzingNeed}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition shrink-0"
              >
                {analyzingNeed ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cpu className="h-4 w-4" />}
                Run Featherless AI Need Analysis
              </button>
            )}

            {project.status === 'NGO_REVIEW' && (
              <button
                onClick={handleApproveNeed}
                disabled={approvingNeed}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition shrink-0"
              >
                {approvingNeed ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Approve AI Analysis & Submit to Corporate
              </button>
            )}

            {project.status === 'COMPLETED' && (
              <Link
                href={`/corporate/reports/${project.id}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition shrink-0"
              >
                <FileText className="h-4 w-4" />
                View Verifiable Impact Report
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Budget</span>
              <span className="font-mono font-bold text-slate-900 text-sm">₹{project.estimated_budget.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Beneficiaries</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{project.beneficiaries.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Location</span>
              <span className="font-semibold text-slate-900">{project.location || 'Gujarat'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Category</span>
              <span className="font-semibold text-slate-900">{project.category}</span>
            </div>
          </div>
        </div>

        {/* 18-Step Timeline */}
        <ProjectLifecycleTimeline currentStatus={project.status} />

        {/* What Happens Next Box */}
        <WhatHappensNext status={project.status} userRole="NGO" />

        {/* AI Need Analysis Section */}
        {(needAnalysis || project.ai_need_analysis) && (
          <div className="p-6 rounded-2xl border border-violet-200 bg-violet-50/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-violet-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-100 text-violet-800">
                  <Cpu className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-bold text-violet-900">Featherless AI Need Structuring Report</h2>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                {(needAnalysis || project.ai_need_analysis)?.ai_powered ? 'Powered by Featherless AI' : 'Deterministic Draft'}
              </span>
            </div>

            {(() => {
              const na = needAnalysis || project.ai_need_analysis!;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Structured Problem Summary:</span>
                      <p className="bg-white p-3 rounded-xl border border-violet-100 text-slate-600 leading-relaxed">{na.problem_summary}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Target Beneficiary Group:</span>
                      <p className="bg-white p-3 rounded-xl border border-violet-100 text-slate-600">{na.beneficiary_group}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Expected Community Impact:</span>
                      <p className="bg-white p-3 rounded-xl border border-violet-100 text-slate-600">{na.expected_impact}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Required Deliverables & Specs:</span>
                      <div className="bg-white p-3 rounded-xl border border-violet-100 space-y-2">
                        {na.required_items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900">{item.item}</span>
                            <span className="font-mono text-slate-600">{item.quantity} units ({item.specification})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 bg-white p-3 rounded-xl border border-violet-100">
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Suggested Timeline</span>
                        <span className="font-bold text-slate-900">{na.suggested_timeline_days} days</span>
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-xl border border-violet-100">
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Urgency Score</span>
                        <span className="font-bold text-amber-900">{na.urgency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 20/40/40 Payment Tracker */}
        {project.contract_value && (
          <PaymentMilestoneTracker payments={payments} contractValue={project.contract_value} />
        )}

        {/* Fulfillment Evidence & Physical Confirmation Section */}
        {delivery && (
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-teal-600" />
                Vendor Fulfillment Proof & Evidence
              </h2>
              <span className="text-xs font-mono text-slate-500">Submitted: {new Date(delivery.submitted_at).toLocaleDateString()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Fulfillment Type</span>
                <span className="font-bold text-slate-900">{delivery.fulfillment_type}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Delivered Quantity / Service</span>
                <span className="font-mono font-bold text-slate-900">{delivery.quantity_delivered || delivery.beneficiaries_served || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Quality Self-Rating</span>
                <span className="font-bold text-teal-700">{delivery.quality}</span>
              </div>
            </div>

            {delivery.evidence && delivery.evidence.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Uploaded Evidence Documents:</span>
                <div className="flex flex-wrap gap-2">
                  {delivery.evidence.map((ev) => (
                    <div key={ev.id} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-teal-600" />
                      <span>{ev.file_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Physical Confirmation Form (NGO Action) */}
        {isFulfillmentPendingConfirmation && (
          <form onSubmit={handleSubmitVerification} className="p-6 rounded-2xl border-2 border-amber-300 bg-amber-50/50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <h2 className="text-sm font-bold text-amber-900">Physical Ground Verification Form</h2>
                <p className="text-xs text-amber-800">Physically inspect the delivered goods/services and confirm below.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity Physically Received <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={verForm.quantity_received}
                  onChange={(e) => setVerForm({ ...verForm, quantity_received: e.target.value })}
                  placeholder={`e.g. ${project.beneficiaries}`}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Invoice / LR Reference</label>
                <input
                  value={verForm.invoice_reference}
                  onChange={(e) => setVerForm({ ...verForm, invoice_reference: e.target.value })}
                  placeholder="e.g. INV-2027-0941"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-xl border bg-white cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={verForm.quality_acceptable}
                  onChange={(e) => setVerForm({ ...verForm, quality_acceptable: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>Quality Acceptable</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-xl border bg-white cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={verForm.packaging_acceptable}
                  onChange={(e) => setVerForm({ ...verForm, packaging_acceptable: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>Packaging Good</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-xl border bg-white cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={verForm.delivered_on_time}
                  onChange={(e) => setVerForm({ ...verForm, delivered_on_time: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>Delivered On Time</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-rose-700 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verForm.has_issue}
                  onChange={(e) => setVerForm({ ...verForm, has_issue: e.target.checked })}
                  className="rounded text-rose-600"
                />
                <span>Report an Issue / Quantity Shortfall / Damage</span>
              </label>

              {verForm.has_issue && (
                <textarea
                  value={verForm.issue_description}
                  onChange={(e) => setVerForm({ ...verForm, issue_description: e.target.value })}
                  rows={3}
                  placeholder="Describe the issue in detail (e.g. received 450 tablets instead of 500; 5 boxes water damaged)."
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-rose-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={submittingVer}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition"
            >
              {submittingVer ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Submit Physical Confirmation to Corporate
            </button>
          </form>
        )}

        {/* Existing NGO Verification Display */}
        {ngoVerification && (
          <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h2 className="text-sm font-bold text-emerald-900">NGO Physical Confirmation Submitted</h2>
              </div>
              <span className="text-xs font-mono text-emerald-700">{new Date(ngoVerification.submitted_at).toLocaleDateString()}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Received Quantity</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{ngoVerification.quantity_received}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Quality</span>
                <span className="font-bold text-emerald-800">{ngoVerification.quality_acceptable ? 'ACCEPTABLE' : 'UNACCEPTABLE'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Timeliness</span>
                <span className="font-bold text-emerald-800">{ngoVerification.delivered_on_time ? 'ON TIME' : 'DELAYED'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Issue Flagged</span>
                <span className={`font-bold ${ngoVerification.has_issue ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {ngoVerification.has_issue ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* AI Cross-Verification Display */}
        {aiVerification && (
          <div className={`p-6 rounded-2xl border shadow-sm space-y-3 ${
            aiVerification.status === 'LIKELY_FULFILLED' ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-300 bg-rose-50/50'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-violet-600" />
                <h2 className="text-sm font-bold text-slate-900">Featherless AI Cross-Verification Result</h2>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                aiVerification.status === 'LIKELY_FULFILLED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {aiVerification.status} ({(aiVerification.confidence * 100).toFixed(0)}% Confidence)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Target Quantity</span>
                <span className="font-mono font-bold text-slate-900">{aiVerification.requested_quantity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Confirmed Received</span>
                <span className="font-mono font-bold text-slate-900">{aiVerification.received_quantity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Completion Percentage</span>
                <span className="font-mono font-bold text-emerald-800">{aiVerification.completion_percentage}%</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
              {aiVerification.recommendation}
            </p>
          </div>
        )}
      </main>

      <AIAssistantDrawer currentRole="NGO" />
    </div>
  );
}
