import React from 'react';
import { ProjectStatus, TenderStatus, PaymentStageStatus, DeliveryStageStatus, AccountStatus } from '@/types';

interface StatusBadgeProps {
  status: ProjectStatus | TenderStatus | PaymentStageStatus | DeliveryStageStatus | AccountStatus | string;
  type?: 'project' | 'tender' | 'payment' | 'delivery' | 'account';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'project', size = 'md' }) => {
  const getStyle = () => {
    switch (status) {
      // ─── Account / KYC Statuses
      case 'ACTIVE':
      case 'KYC_APPROVED':
      case 'VERIFIED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'KYC_PENDING':
      case 'DOCUMENTS_SUBMITTED':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'KYC_REJECTED':
      case 'REJECTED':
        return 'bg-rose-50 text-rose-800 border-rose-300';

      // ─── Project Statuses
      case 'DRAFT':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'AI_ANALYZING':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'NGO_REVIEW':
      case 'SUBMITTED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'CORPORATE_REVIEW':
      case 'CORPORATE_INTERESTED':
      case 'LOCKED':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200';
      case 'TENDER_OPEN':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'TENDER_CLOSED':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'AI_EVALUATED':
      case 'AI_COMPARISON_READY':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'BUSINESS_SELECTED':
      case 'SELECTED':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'CONTRACTED':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'ADVANCE_20_PAID':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'IN_PROGRESS':
      case 'IN EXECUTION':
      case 'ONGOING':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'FULFILLMENT_SUBMITTED':
      case 'DELIVERY_SUBMITTED':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'MILESTONE_40_PAID':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'NGO_CONFIRMATION_PENDING':
        return 'bg-yellow-50 text-yellow-900 border-yellow-300';
      case 'NGO_CONFIRMED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'FINAL_40_PAID':
      case 'FULLY_PAID':
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
      case 'MANUAL_REVIEW':
      case 'ISSUE_RAISED':
      case 'DISPUTED':
        return 'bg-rose-100 text-rose-900 border-rose-400 font-bold';

      // ─── Payment Statuses
      case '20_PERCENT_PENDING':
      case '0%':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case '20_PERCENT_PAID':
      case '20%':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case '40_PERCENT_PENDING':
        return 'bg-yellow-50 text-yellow-900 border-yellow-300';
      case '40_PERCENT_PAID':
      case '60%':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'FINAL_40_PERCENT_PENDING':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case '100%':
        return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';

      // ─── Delivery Statuses
      case 'NOT_STARTED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'SUBMITTED_DOCUMENTS':
        return 'bg-sky-50 text-sky-800 border-sky-200';

      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getLabel = () => {
    if (typeof status !== 'string') return String(status);
    return status.replace(/_/g, ' ');
  };

  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide ${sizeClasses} ${getStyle()}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current flex-shrink-0" />
      <span>{getLabel()}</span>
    </span>
  );
};
