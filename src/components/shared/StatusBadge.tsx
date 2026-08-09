import React from 'react';
import { ProjectStatus } from '@/types';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyle = (st: ProjectStatus) => {
    switch (st) {
      case 'DRAFT': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'AI_ANALYZING': return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'NGO_REVIEW': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'CORPORATE_REVIEW': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'CORPORATE_INTERESTED': return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'TENDER_OPEN': return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'TENDER_CLOSED': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'AI_EVALUATED': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'BUSINESS_SELECTED': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'CONTRACTED': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'ADVANCE_20_PAID': return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'FULFILLMENT_SUBMITTED': return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'MILESTONE_40_PAID': return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'NGO_CONFIRMATION_PENDING': return 'bg-yellow-50 text-yellow-900 border-yellow-300';
      case 'NGO_CONFIRMED': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'FINAL_40_PAID': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
      case 'MANUAL_REVIEW': return 'bg-rose-100 text-rose-900 border-rose-400 font-bold';
      case 'DISPUTED': return 'bg-red-100 text-red-900 border-red-400 font-bold';
      case 'REJECTED': return 'bg-slate-200 text-slate-700 border-slate-400';
      case 'CANCELLED': return 'bg-slate-200 text-slate-700 border-slate-400';
      case 'EXPIRED': return 'bg-slate-200 text-slate-700 border-slate-400';
      // Legacy states
      case 'CSR_APPROVED' as any: return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'PUBLISHED' as any: return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'PROPOSALS_OPEN' as any: return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'ADVANCE_PAID' as any: return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'DELIVERY_SUBMITTED' as any: return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'AI_VERIFIED' as any: return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
      case 'NGO_VERIFIED' as any: return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const rawLabel = typeof status === 'string' ? status.replace(/_/g, ' ') : String(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide ${sizeClasses} ${getStyle(status)}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current flex-shrink-0" />
      {rawLabel}
    </span>
  );
};
