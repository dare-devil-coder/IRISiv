'use client';

import React from 'react';
import { ProjectStatus } from '@/types';
import { StateMachineService } from '@/lib/services/stateMachineService';
import { CheckCircle2, Circle, Clock, AlertTriangle, GitCommit } from 'lucide-react';

interface ProjectLifecycleTimelineProps {
  currentStatus: ProjectStatus;
}

const LIFECYCLE_STEPS = [
  { key: 'DRAFT', label: 'NGO Need', desc: 'Requirement created' },
  { key: 'AI_ANALYZING', label: 'AI Analyzing', desc: 'Structuring need' },
  { key: 'NGO_REVIEW', label: 'NGO Review', desc: 'Approve AI output' },
  { key: 'SUBMITTED', label: 'Submitted', desc: 'Awaiting corporate' },
  { key: 'CORPORATE_REVIEW', label: 'Corp Review', desc: 'Evaluating fit' },
  { key: 'CORPORATE_INTERESTED', label: 'Corp Interested', desc: 'Tender being created' },
  { key: 'TENDER_OPEN', label: 'Tender Open', desc: 'Quotations open' },
  { key: 'TENDER_CLOSED', label: 'Tender Closed', desc: 'AI evaluating' },
  { key: 'AI_EVALUATED', label: 'AI Evaluated', desc: 'Scores ready' },
  { key: 'BUSINESS_SELECTED', label: 'Vendor Selected', desc: 'Contract pending' },
  { key: 'CONTRACTED', label: 'Contracted', desc: 'Terms agreed' },
  { key: 'ADVANCE_20_PAID', label: '20% Advance', desc: 'Work can start' },
  { key: 'IN_PROGRESS', label: 'Executing', desc: 'Work underway' },
  { key: 'FULFILLMENT_SUBMITTED', label: 'Fulfillment', desc: 'Proof submitted' },
  { key: 'MILESTONE_40_PAID', label: '40% Milestone', desc: 'NGO confirming' },
  { key: 'NGO_CONFIRMED', label: 'NGO Confirmed', desc: 'Final payment' },
  { key: 'FINAL_40_PAID', label: '40% Final', desc: 'Report generating' },
  { key: 'COMPLETED', label: 'Completed ✓', desc: 'Impact certified' },
];

export const ProjectLifecycleTimeline: React.FC<ProjectLifecycleTimelineProps> = ({ currentStatus }) => {
  const currentIndex = StateMachineService.getStepIndex(currentStatus);
  const isException = StateMachineService.isExceptionState(currentStatus);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
            <GitCommit className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">IRISiv CSR Lifecycle — 18-Step State Machine</h3>
            <p className="text-xs text-slate-500 mt-0.5">NGO Need → AI → Tender → Quotation → 20/40/40 → Impact Report</p>
          </div>
        </div>

        {isException && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <AlertTriangle className="h-4 w-4" />
            <span>{currentStatus === 'MANUAL_REVIEW' ? '⚠ Manual Review' : currentStatus === 'DISPUTED' ? '⚠ Disputed' : currentStatus}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
        {LIFECYCLE_STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={step.key}
              className={`relative flex flex-col p-2.5 rounded-xl border transition-all ${
                isCurrent
                  ? isException
                    ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-sm'
                    : 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm'
                  : isDone
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-white border-slate-100 text-slate-400 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400">{idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                ) : isCurrent ? (
                  isException ? (
                    <AlertTriangle className="h-3 w-3 text-rose-600 animate-bounce" />
                  ) : (
                    <Clock className="h-3 w-3 text-teal-600 animate-spin" />
                  )
                ) : (
                  <Circle className="h-3 w-3 text-slate-200" />
                )}
              </div>
              <p className={`text-[10px] font-bold leading-tight ${
                isCurrent ? (isException ? 'text-rose-900' : 'text-teal-900') : isDone ? 'text-slate-800' : 'text-slate-400'
              }`}>
                {step.label}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
