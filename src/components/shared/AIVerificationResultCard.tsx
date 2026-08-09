'use client';

import React from 'react';
import { AIVerification, NGOVerification } from '@/types';
import { ShieldCheck, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';

interface AIVerificationResultCardProps {
  aiVerification?: AIVerification;
  ngoVerification?: NGOVerification;
}

export const AIVerificationResultCard: React.FC<AIVerificationResultCardProps> = ({
  aiVerification,
  ngoVerification,
}) => {
  if (!aiVerification || !ngoVerification) {
    return (
      <div className="p-4 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs flex items-center gap-2 shadow-sm">
        <Sparkles className="h-4 w-4 text-teal-600 animate-spin" />
        <span>Awaiting NGO delivery verification and AI analysis...</span>
      </div>
    );
  }

  const isFulfilled = aiVerification.status === 'LIKELY_FULFILLED';
  const hasMismatch = aiVerification.issues && aiVerification.issues.length > 0;

  return (
    <div
      className={`rounded-2xl border p-6 backdrop-blur-sm transition-all shadow-sm ${
        isFulfilled
          ? 'border-emerald-200 bg-white shadow-emerald-500/5'
          : 'border-rose-200 bg-white shadow-rose-500/5'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isFulfilled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {isFulfilled ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6 animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">AI & NGO Multi-Point Verification Engine</h4>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  isFulfilled
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                {aiVerification.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Dual-layer validation of vendor delivery against NGO physical check</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {Math.round(aiVerification.confidence * 100)}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">AI Confidence Score</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Requested</span>
          <p className="text-base font-bold text-slate-900 font-mono mt-0.5">
            {aiVerification.requested_quantity.toLocaleString()} units
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">NGO Received</span>
          <p
            className={`text-base font-bold font-mono mt-0.5 ${
              isFulfilled ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {aiVerification.received_quantity.toLocaleString()} units
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Completion Rate</span>
          <p className="text-base font-bold text-teal-700 font-mono mt-0.5">
            {aiVerification.completion_percentage}%
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">NGO Representative</span>
          <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Certified
          </p>
        </div>
      </div>

      {/* Mismatch Warning Box */}
      {hasMismatch && (
        <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
          <div className="flex items-center gap-2 font-bold text-rose-800 mb-1 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>⚠ Quantity Mismatch Detected by AI</span>
          </div>
          {aiVerification.issues.map((iss, i) => (
            <p key={i} className="leading-relaxed mt-1 text-rose-800 font-medium">
              {iss.message}
            </p>
          ))}
        </div>
      )}

      {/* Recommendation Banner */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs">
        <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed text-slate-700">
          <strong className="text-slate-900">AI Verification Recommendation: </strong>
          {aiVerification.recommendation}
          <div className="mt-1 text-[11px] text-slate-500 italic">
            * Note: AI functions as a verification assistant. Corporate approval remains required to execute final 70% payment.
          </div>
        </div>
      </div>
    </div>
  );
};
