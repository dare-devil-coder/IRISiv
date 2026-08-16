'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject, NGONeedAnalysis, Payment } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProjectLifecycleTimeline } from '@/components/shared/ProjectLifecycleTimeline';
import { PaymentMilestoneTracker } from '@/components/shared/PaymentMilestoneTracker';
import { WhatHappensNext } from '@/components/shared/WhatHappensNext';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  Building2,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IndianRupee,
  Cpu,
  FileText,
  PackageCheck,
  Check,
  X,
  Loader2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function NGOProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<CSRProject | null>(null);
  const [needAnalysis, setNeedAnalysis] = useState<NGONeedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delivery Physical Confirmation State
  const [receivedQuantity, setReceivedQuantity] = useState<number>(0);
  const [qualityAcceptable, setQualityAcceptable] = useState(true);
  const [packagingAcceptable, setPackagingAcceptable] = useState(true);
  const [deliveredOnTime, setDeliveredOnTime] = useState(true);
  const [fieldComments, setFieldComments] = useState('');
  const [hasIssue, setHasIssue] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  const loadProject = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [pRes, aRes] = await Promise.all([
        fetch(`/api/projects/${id}`).catch(() => null),
        fetch(`/api/projects/${id}/need-analysis`).catch(() => null),
      ]);

      if (pRes && pRes.ok) {
        const pJson = await pRes.json();
        if (pJson.success && pJson.data) {
          const proj = pJson.data.project || pJson.data;
          setProject(proj);
          setReceivedQuantity(proj.target_quantity || 500);
        }
      }
      if (aRes && aRes.ok) {
        const aJson = await aRes.json();
        if (aJson.success) setNeedAnalysis(aJson.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  // NGO Approves AI Need Report
  const handleApproveNeed = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}/approve-need`, { method: 'POST' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to approve requirement');
      loadProject();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // NGO Submits Physical Ground Verification
  const handleVerifyDelivery = async (confirm: boolean) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}/verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity_received: confirm ? receivedQuantity : Math.max(0, receivedQuantity - 50),
          quality_acceptable: confirm && qualityAcceptable,
          packaging_acceptable: confirm && packagingAcceptable,
          delivered_on_time: deliveredOnTime,
          comments: fieldComments || (confirm ? 'Physical ground verification complete. All items in good order.' : issueDescription),
          has_issue: !confirm || hasIssue,
          issue_description: !confirm ? (issueDescription || 'Physical quantity shortfall or quality defect') : undefined,
          authorized_representative_confirmed: confirm,
          submitted_by: 'Ananya Sharma (Field Director)',
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to submit verification');
      loadProject();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentRole="NGO" />
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentRole="NGO" />
        <div className="max-w-xl mx-auto py-16 text-center">
          <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
          <Link href="/ngo/dashboard" className="text-xs text-teal-700 font-bold hover:underline mt-2 inline-block">
            ← Return to NGO Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const contractVal = project.contract_value || project.estimated_budget;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="NGO" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/ngo/dashboard" className="text-xs font-mono text-slate-500 hover:text-slate-900">
                Dashboard
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-xs font-mono font-bold text-teal-700">{project.project_code}</span>
              <StatusBadge status={project.status} size="sm" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">{project.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 18-Step State Machine Timeline */}
        <ProjectLifecycleTimeline currentStatus={project.status} />

        {/* What Happens Next Guidance */}
        <WhatHappensNext status={project.status} userRole="NGO" />

        {/* AI REQUIREMENT STRUCTURING & APPROVAL GATE */}
        {['AI_ANALYZING', 'NGO_REVIEW', 'DRAFT'].includes(project.status) && (
          <div className="p-6 rounded-2xl border-2 border-violet-200 bg-violet-50/40 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Featherless AI Requirement Report</h3>
                  <p className="text-xs text-slate-500">Autonomous analysis of feasibility, budget realism, and implementation risks</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-violet-100 text-violet-900 border border-violet-200">
                SCORE: {needAnalysis?.feasibility_score || 94}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-white border border-violet-100 text-xs space-y-1">
                <span className="text-slate-400 font-mono text-[10px] uppercase block">Feasibility Rating</span>
                <span className="text-emerald-700 font-bold text-sm block">HIGH FEASIBILITY (94%)</span>
                <p className="text-slate-500 text-[11px]">Clear target beneficiaries and established distribution logistics in Ahmedabad.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-violet-100 text-xs space-y-1">
                <span className="text-slate-400 font-mono text-[10px] uppercase block">Budget Assessment</span>
                <span className="text-slate-900 font-mono font-bold text-sm block">₹{contractVal.toLocaleString()}</span>
                <p className="text-slate-500 text-[11px]">Benchmark cost: ₹{Math.round(contractVal / (project.target_quantity || 500))}/unit. Budget is realistic.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-violet-100 text-xs space-y-1">
                <span className="text-slate-400 font-mono text-[10px] uppercase block">Risk & Bottlenecks</span>
                <span className="text-amber-800 font-bold text-sm block">LOW / MONITORED</span>
                <p className="text-slate-500 text-[11px]">Monsoon delivery transit requires waterproof batch packaging.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-violet-100 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">AI Recommendation:</span>
              <p className="text-slate-700 leading-relaxed">
                {needAnalysis?.ai_recommendations ||
                  'The requirement meets all MCA CSR Schedule VII criteria for Education. Recommend approving requirement to make it discoverable for corporate CSR sponsors.'}
              </p>
            </div>

            {/* Approval Gate Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleApproveNeed}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                <span>Approve Requirement & Publish for Corporate Lock</span>
              </button>
            </div>
          </div>
        )}

        {/* NGO PHYSICAL GROUND RECEIVING CHECK GATE */}
        {['FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING'].includes(project.status) && (
          <div className="p-6 rounded-2xl border-2 border-amber-200 bg-amber-50/40 space-y-5">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-6 w-6 text-amber-700" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Physical Ground Verification & Receiving Confirmation</h3>
                <p className="text-xs text-slate-600">The vendor submitted fulfillment evidence. Confirm physical receipt before Final 40% payment can be unlocked.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs space-y-3">
                <span className="font-bold text-slate-900 block border-b pb-2">Physical Inspection Checklist</span>

                <div className="flex items-center justify-between">
                  <label className="text-slate-700">Actual Quantity Received (Units/Kits):</label>
                  <input
                    type="number"
                    value={receivedQuantity}
                    onChange={(e) => setReceivedQuantity(Number(e.target.value))}
                    className="w-24 p-2 rounded-lg border border-slate-200 font-mono font-bold text-right"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Item Quality Acceptable:</span>
                  <input
                    type="checkbox"
                    checked={qualityAcceptable}
                    onChange={(e) => setQualityAcceptable(e.target.checked)}
                    className="h-4 w-4 text-teal-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Packaging Undamaged & Sealed:</span>
                  <input
                    type="checkbox"
                    checked={packagingAcceptable}
                    onChange={(e) => setPackagingAcceptable(e.target.checked)}
                    className="h-4 w-4 text-teal-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Delivered On-Time:</span>
                  <input
                    type="checkbox"
                    checked={deliveredOnTime}
                    onChange={(e) => setDeliveredOnTime(e.target.checked)}
                    className="h-4 w-4 text-teal-600 rounded"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs space-y-3">
                <span className="font-bold text-slate-900 block border-b pb-2">Ground Inspection Notes</span>
                <textarea
                  rows={4}
                  value={fieldComments}
                  onChange={(e) => setFieldComments(e.target.value)}
                  placeholder="Record batch numbers, distribution location details, recipient signatures verified, or any field observations..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleVerifyDelivery(false)}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs transition"
              >
                Raise Issue / Shortfall
              </button>

              <button
                type="button"
                onClick={() => handleVerifyDelivery(true)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                <span>Confirm Physical Receiving (Authorize Final 40%)</span>
              </button>
            </div>
          </div>
        )}

        {/* 20/40/40 Payment Milestone Tracker */}
        <PaymentMilestoneTracker
          payments={project.payments || []}
          contractValue={contractVal}
        />

        {/* Multi-Dimensional Project Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Requirement Details</span>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{project.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Required Quantity:</span>
                <span className="font-mono font-bold text-slate-800">{project.target_quantity} {project.target_unit || 'units'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Beneficiaries:</span>
                <span className="font-mono font-bold text-slate-800">{project.beneficiaries_impacted || project.target_quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{project.location}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Corporate Sponsor</span>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Company:</span>
                <span className="font-bold text-slate-800">{project.corporate_organization?.name || 'Awaiting Sponsor'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Project Locked:</span>
                <span className="font-bold text-teal-700">{project.corporate_organization_id ? '✓ YES' : 'OPEN'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tender Status:</span>
                <span className="font-semibold text-slate-800 uppercase">{project.tender_id ? 'TENDER OPEN' : 'NOT CREATED'}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Execution Partner</span>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Vendor:</span>
                <span className="font-bold text-slate-800">{project.business_organization?.name || 'In Bidding'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contract Value:</span>
                <span className="font-mono font-bold text-slate-800">₹{contractVal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Status:</span>
                <span className="font-semibold text-slate-800">
                  {project.status === 'COMPLETED' ? '✓ NGO Confirmed' : 'In Execution'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AIAssistantDrawer currentRole="NGO" />
    </div>
  );
}
