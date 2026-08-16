'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CSRProject } from '@/types';
import { StatusBadge } from './StatusBadge';
import { PaymentMilestoneTracker } from './PaymentMilestoneTracker';
import {
  X,
  ShieldCheck,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  AlertTriangle,
  IndianRupee,
  Cpu,
  ArrowRight,
  PackageCheck,
  Download,
  Loader2,
} from 'lucide-react';

interface ProjectStatusModalProps {
  project: CSRProject | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const ProjectStatusModal: React.FC<ProjectStatusModalProps> = ({
  project,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const contractVal = project.contract_value || project.estimated_budget;

  // Release 20% Advance Payment
  const handleRelease20 = async () => {
    setActionLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/payment/advance`, { method: 'POST' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to release 20% advance');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Release 40% Milestone Payment
  const handleRelease40 = async () => {
    setActionLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/payment/milestone`, { method: 'POST' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to release 40% milestone');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Release Final 40% Payment
  const handleReleaseFinal40 = async () => {
    setActionLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/payment/final`, { method: 'POST' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to release final 40%');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Determine Lifecycle Step Progression
  const steps = [
    { label: 'Project Locked', isDone: true },
    {
      label: 'Tender Created',
      isDone: !!project.tender_id || ['TENDER_OPEN', 'TENDER_CLOSED', 'AI_EVALUATED', 'BUSINESS_SELECTED', 'CONTRACTED', 'ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(project.status),
    },
    {
      label: 'Vendor Selected',
      isDone: ['BUSINESS_SELECTED', 'CONTRACTED', 'ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(project.status),
    },
    {
      label: '20% Advance Paid',
      isDone: ['ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(project.status),
    },
    {
      label: 'Delivery Proof Uploaded',
      isDone: ['FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(project.status),
    },
    {
      label: '40% Milestone Paid',
      isDone: ['MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(project.status),
    },
    {
      label: 'NGO Physical Ground Check',
      isDone: ['NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(project.status),
    },
    {
      label: 'Final 40% Paid',
      isDone: ['FINAL_40_PAID', 'COMPLETED'].includes(project.status),
    },
    {
      label: 'Completed & Certified',
      isDone: project.status === 'COMPLETED',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-teal-700">{project.project_code}</span>
              <StatusBadge status={project.status} size="sm" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">{project.title}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
              <span><strong>NGO:</strong> {project.ngo_organization?.name || 'Shiksha Foundation'}</span>
              <span>•</span>
              <span><strong>Corporate:</strong> {project.corporate_organization?.name || 'Apex Global Technologies'}</span>
              <span>•</span>
              <span><strong>Value:</strong> ₹{contractVal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Step Progression Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-3">Lifecycle Journey</span>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1 text-center">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                      step.isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.isDone ? '✓' : idx + 1}
                  </div>
                  <span className="text-[9px] font-semibold text-slate-700 leading-tight line-clamp-2">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Workflow Stage Action Box (Stages A through I) */}
          <div className="p-6 rounded-2xl border-2 border-teal-200 bg-teal-50/40 space-y-4">
            {/* Stage A: Project Locked, Tender Not Created */}
            {project.status === 'CORPORATE_INTERESTED' && !project.tender_id && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Stage A: Project Locked — Tender Not Released</h3>
                </div>
                <p className="text-xs text-slate-600">
                  This CSR requirement has been successfully locked by Apex Global Technologies. The next operational step is to create and publish a blind procurement tender for vendors.
                </p>
                <Link
                  href={`/corporate/tenders/new?projectId=${project.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <FileText className="h-4 w-4" />
                  <span>OPEN TENDER</span>
                </Link>
              </div>
            )}

            {/* Stage B: Tender Open */}
            {project.status === 'TENDER_OPEN' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900">Stage B: Tender is Open for Blind Quotations</h3>
                </div>
                <p className="text-xs text-slate-600">
                  Vendors matching the business domain are reviewing requirements and submitting blind quotations.
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/corporate/tenders/${project.tender_id || 'tender-101'}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition"
                  >
                    View Tender Applications
                  </Link>
                </div>
              </div>
            )}

            {/* Stage C & D: Tender Closed / AI Evaluated -> Select Vendor */}
            {['TENDER_CLOSED', 'AI_EVALUATED'].includes(project.status) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-violet-600" />
                  <h3 className="text-sm font-bold text-slate-900">Stage D: AI Quotation Scoring Ready — Select Business</h3>
                </div>
                <p className="text-xs text-slate-600">
                  Featherless AI has evaluated all incoming bids across the 7-factor scoring matrix. Review the side-by-side comparison table to choose the execution partner.
                </p>
                <Link
                  href={`/corporate/tenders/${project.tender_id || 'tender-101'}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <Cpu className="h-4 w-4" />
                  <span>Review AI Comparison & Select Business</span>
                </Link>
              </div>
            )}

            {/* Stage E: Business Selected & Contracted -> Release 20% Advance */}
            {['BUSINESS_SELECTED', 'CONTRACTED'].includes(project.status) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Stage E: Vendor Contracted — Release 20% Advance</h3>
                </div>
                <p className="text-xs text-slate-600">
                  Contract established with <strong>{project.business_organization?.name || 'Selected Vendor'}</strong>. Release the 20% advance payment (₹{Math.round(contractVal * 0.2).toLocaleString()}) so work and material procurement can begin.
                </p>
                <button
                  onClick={handleRelease20}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <IndianRupee className="h-4 w-4" />}
                  <span>Release 20% Advance Payment (₹{Math.round(contractVal * 0.2).toLocaleString()})</span>
                </button>
              </div>
            )}

            {/* Stage F: Delivery Submitted -> Review Proof & Release 40% Milestone */}
            {project.status === 'FULFILLMENT_SUBMITTED' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Stage F: Fulfillment Proof Submitted — Release 40% Milestone</h3>
                </div>
                <p className="text-xs text-slate-600">
                  Vendor has uploaded delivery receipts, LR notes, and execution photos. Release the 40% milestone payment (₹{Math.round(contractVal * 0.4).toLocaleString()}) to prompt NGO ground verification.
                </p>
                <button
                  onClick={handleRelease40}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>Release 40% Milestone Payment (₹{Math.round(contractVal * 0.4).toLocaleString()})</span>
                </button>
              </div>
            )}

            {/* Stage G: Waiting for NGO Ground Check */}
            {['MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING'].includes(project.status) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900">Stage G: Waiting for NGO Physical Ground Verification</h3>
                </div>
                <p className="text-xs text-slate-600">
                  40% milestone recorded. <strong>{project.ngo_organization?.name || 'NGO Partner'}</strong> has been notified to physically inspect delivered items on the ground and submit confirmation.
                </p>
              </div>
            )}

            {/* Stage H: NGO Confirmed -> Release Final 40% Payment */}
            {project.status === 'NGO_CONFIRMED' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Stage H: NGO Confirmed Receipt — Release Final 40%</h3>
                </div>
                <p className="text-xs text-slate-600">
                  NGO verified 100% receipt with acceptable quality. Release the final 40% payment (₹{Math.round(contractVal * 0.4).toLocaleString()}) to conclude the contract and generate the certified Impact Report.
                </p>
                <button
                  onClick={handleReleaseFinal40}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <IndianRupee className="h-4 w-4" />}
                  <span>Release Final 40% Payment (₹{Math.round(contractVal * 0.4).toLocaleString()})</span>
                </button>
              </div>
            )}

            {/* Exception Stage: Manual Review / Issue Detected */}
            {['MANUAL_REVIEW', 'DISPUTED'].includes(project.status) && (
              <div className="space-y-3 p-4 rounded-xl bg-rose-50 border border-rose-300">
                <div className="flex items-center gap-2 text-rose-800">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  <h3 className="text-sm font-bold">ISSUE DETECTED — Manual Discrepancy Review Required</h3>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed">
                  NGO flagged a physical delivery shortfall or quality discrepancy (e.g. 950 / 1000 items delivered — 95% fulfillment). Final payment is held in escrow until rectified.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReleaseFinal40}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Authorize Adjusted Payout</span>
                  </button>
                </div>
              </div>
            )}

            {/* Stage I: Completed & Impact Certified */}
            {project.status === 'COMPLETED' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-emerald-950">Stage I: Project Completed — 100% Disbursed & Certified</h3>
                </div>
                <p className="text-xs text-slate-600">
                  All 3 payments (20% + 40% + 40%) have been completed. The audit-ready impact certificate has been generated.
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/corporate/reports/${project.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View AI Impact Report</span>
                  </Link>
                  <Link
                    href="/corporate/reviews"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
                  >
                    <span>Leave Partner Reviews</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Payment Milestone Tracker */}
          <PaymentMilestoneTracker
            payments={project.payments || []}
            contractValue={contractVal}
          />
        </div>
      </div>
    </div>
  );
};
