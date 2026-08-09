'use client';

import React from 'react';
import { ProposalEvaluation } from '@/types';
import { Sparkles, Award, ShieldCheck } from 'lucide-react';

interface AIEvaluationCardProps {
  evaluation?: ProposalEvaluation;
}

export const AIEvaluationCard: React.FC<AIEvaluationCardProps> = ({ evaluation }) => {
  if (!evaluation) {
    return (
      <div className="p-4 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs flex items-center gap-2 shadow-sm">
        <Sparkles className="h-4 w-4 text-teal-600 animate-spin" />
        <span>AI Proposal Evaluation pending...</span>
      </div>
    );
  }

  const scores = [
    { label: 'Cost Efficiency', score: evaluation.cost_score, weight: '30%' },
    { label: 'Delivery Timeline', score: evaluation.timeline_score, weight: '25%' },
    { label: 'Vendor Capacity', score: evaluation.capacity_score, weight: '20%' },
    { label: 'Past Experience', score: evaluation.experience_score, weight: '15%' },
    { label: 'Feasibility Risk', score: evaluation.feasibility_score, weight: '10%' },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Featherless AI Proposal Score
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                LLM Multi-Criteria Analysis
              </span>
            </h4>
            <p className="text-xs text-slate-500">Objective decision support for Corporate selection</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-teal-700 font-mono">
            {evaluation.overall_score}
            <span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 flex items-center justify-end gap-1">
            <ShieldCheck className="h-3 w-3" /> AI Evaluated
          </span>
        </div>
      </div>

      {/* Recommendation Banner */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs">
        <Award className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">{evaluation.recommendation}</span>
          <p className="text-slate-600 mt-0.5 leading-relaxed">{evaluation.reasoning}</p>
        </div>
      </div>

      {/* Score Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {scores.map((s) => (
          <div key={s.label} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-700 font-medium">{s.label}</span>
              <span className="font-mono font-bold text-teal-800">{s.score}/100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-500"
                style={{ width: `${s.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
