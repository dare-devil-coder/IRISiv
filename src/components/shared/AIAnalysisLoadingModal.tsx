'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';

interface AIAnalysisLoadingModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
}

const DEFAULT_STEPS = [
  'Initializing Featherless AI Neural Engine...',
  'Connecting to Qwen-2.5-72B-Instruct inference model...',
  'Analyzing proposal cost, delivery timeline, capacity & experience...',
  'Running multi-point physical vs requested cross-validation...',
  'Synthesizing verifiable trust scores & generating audit record...',
];

export const AIAnalysisLoadingModal: React.FC<AIAnalysisLoadingModalProps> = ({
  isOpen,
  title = 'Featherless AI Analysis in Progress',
  subtitle = 'Evaluating data against CSR guidelines & running multi-point verification...',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(15);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 15) + 10;
      });

      setCurrentStepIndex((prev) => {
        if (prev < DEFAULT_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl text-slate-900 space-y-6 text-center relative overflow-hidden">
        {/* Central Animated AI Icon */}
        <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-teal-500/20 animate-pulse opacity-75 blur-md" />
          <div className="relative h-20 w-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-lg">
            <Sparkles className="h-10 w-10 text-teal-600 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-mono font-bold tracking-wider uppercase mb-2">
            <Cpu className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
            <span>Featherless AI Engine</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Dynamic Progress Bar & Step Text */}
        <div className="space-y-3 pt-2">
          <div className="h-2.5 w-full rounded-full bg-slate-100 border border-slate-200 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 px-1">
            <span className="flex items-center gap-1.5 text-teal-700 font-semibold truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              {DEFAULT_STEPS[currentStepIndex]}
            </span>
            <span className="font-bold text-slate-900 ml-2">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
