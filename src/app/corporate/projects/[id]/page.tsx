'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProjectLifecycleTimeline } from '@/components/shared/ProjectLifecycleTimeline';
import { PaymentMilestoneTracker } from '@/components/shared/PaymentMilestoneTracker';
import { WhatHappensNext } from '@/components/shared/WhatHappensNext';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject, Fulfillment, NGOVerification, AIVerification, Payment } from '@/types';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Briefcase,
  Loader2,
  IndianRupee,
  Cpu,
  PackageCheck,
  Award,
} from 'lucide-react';

export default function CorporateProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<CSRProject | null>(null);
  const [delivery, setDelivery] = useState<Fulfillment | null>(null);
  const [ngoVerification, setNGOVerification] = useState<NGOVerification | null>(null);
  const [aiVerification, setAIVerification] = useState<AIVerification | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [recordingAdvance, setRecordingAdvance] = useState(false);
  const [releasingFinal, setReleasingFinal] = useState(false);
  const [expressingInterest, setExpressingInterest] = useState(false);

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

  const handleExpressInterest = async () => {
    setExpressingInterest(true);
    try {
      const res = await fetch(`/api/projects/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corporate_organization_id: 'org-corp-1' }),
      });
      const json = await res.json();
      if (json.success) await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setExpressingInterest(false);
    }
  };

  const handleRecordAdvance = async () => {
    setRecordingAdvance(true);
    try {
      const res = await fetch(`/api/projects/${id}/payment/advance`, { method: 'POST' });
      const json = await res.json();
      if (json.success) await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setRecordingAdvance(false);
    }
  };

  const handleReleaseFinal = async () => {
    setReleasingFinal(true);
    try {
      const res = await fetch(`/api/projects/${id}/payment/final`, { method: 'POST' });
      const json = await res.json();
      if (json.success) await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setReleasingFinal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">Project Not Found</p>
          <Link href="/corporate/dashboard" className="text-xs text-emerald-600 font-bold mt-2 inline-block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const contractVal = project.contract_value || project.estimated_budget;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <Link href="/corporate/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Corporate Dashboard
        </Link>

        {/* Header Card */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-teal-700">{project.project_code}</span>
                <StatusBadge status={project.status} size="sm" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{project.title}</h1>
            </div>

            {/* Action Buttons based on status */}
            <div className="flex flex-wrap items-center gap-2">
              {project.status === 'SUBMITTED' && (
                <button
                  onClick={handleExpressInterest}
                  disabled={expressingInterest}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  {expressingInterest ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Express Interest & Create Tender
                </button>
              )}

              {project.status === 'CORPORATE_INTERESTED' && !project.tender_id && (
                <Link
                  href={`/corporate/tenders/new?projectId=${project.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Publish Procurement Tender
                </Link>
              )}

              {project.status === 'CONTRACTED' && (
                <button
                  onClick={handleRecordAdvance}
                  disabled={recordingAdvance}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
                >
                  {recordingAdvance ? <Loader2 className="h-4 w-4 animate-spin" /> : <IndianRupee className="h-4 w-4" />}
                  Record 20% Advance Payment (₹{Math.round(contractVal * 0.2).toLocaleString()})
                </button>
              )}

              {['NGO_CONFIRMED', 'MANUAL_REVIEW'].includes(project.status) && (
                <button
                  onClick={handleReleaseFinal}
                  disabled={releasingFinal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  {releasingFinal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                  Release Final 40% Payment (₹{Math.round(contractVal * 0.4).toLocaleString()})
                </button>
              )}

              {project.status === 'COMPLETED' && (
                <Link
                  href={`/corporate/reports/${project.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <FileText className="h-4 w-4" />
                  View Impact Report
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Contract Value</span>
              <span className="font-mono font-bold text-slate-900 text-sm">₹{contractVal.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Beneficiaries</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{project.beneficiaries.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">NGO Partner</span>
              <span className="font-semibold text-slate-900">{project.ngo_organization?.name || 'Shiksha Foundation'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Vendor Partner</span>
              <span className="font-semibold text-slate-900">{project.business_organization?.name || 'TechSolutions India'}</span>
            </div>
          </div>
        </div>

        {/* 18-Step Timeline */}
        <ProjectLifecycleTimeline currentStatus={project.status} />

        {/* What Happens Next */}
        <WhatHappensNext status={project.status} userRole="CORPORATE" />

        {/* 20/40/40 Payment Tracker */}
        <PaymentMilestoneTracker payments={payments} contractValue={contractVal} />

        {/* AI Cross-Verification Display */}
        {aiVerification && (
          <div className={`p-6 rounded-2xl border shadow-sm space-y-3 ${
            aiVerification.status === 'LIKELY_FULFILLED' ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-300 bg-rose-50/50'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-violet-600" />
                <h2 className="text-sm font-bold text-slate-900">Featherless AI Cross-Verification Audit</h2>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                aiVerification.status === 'LIKELY_FULFILLED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {aiVerification.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Target Quantity</span>
                <span className="font-bold text-slate-900">{aiVerification.requested_quantity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">NGO Physical Check</span>
                <span className="font-bold text-slate-900">{aiVerification.received_quantity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Completion</span>
                <span className="font-bold text-emerald-800">{aiVerification.completion_percentage}%</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
              {aiVerification.recommendation}
            </p>
          </div>
        )}
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
