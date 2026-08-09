'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'ai' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const isAI = toast.type === 'ai';
  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-slide-in ${
        isAI
          ? 'bg-white border-teal-300 shadow-teal-500/10 text-slate-900'
          : isSuccess
          ? 'bg-white border-emerald-300 shadow-emerald-500/10 text-slate-900'
          : isWarning
          ? 'bg-amber-50 border-amber-300 text-amber-900'
          : 'bg-rose-50 border-rose-300 text-rose-900'
      }`}
    >
      <div className="p-2 rounded-xl shrink-0 mt-0.5">
        {isAI && <Sparkles className="h-5 w-5 text-teal-600 animate-spin" style={{ animationDuration: '3s' }} />}
        {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        {isWarning && <AlertTriangle className="h-5 w-5 text-amber-600" />}
        {isError && <X className="h-5 w-5 text-rose-600" />}
      </div>

      <div className="flex-1 space-y-1 pr-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-slate-900">{toast.title}</span>
          {isAI && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              FEATHERLESS AI
            </span>
          )}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{toast.message}</p>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
