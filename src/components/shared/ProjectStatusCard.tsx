'use client';

import React from 'react';
import Link from 'next/link';
import { CSRProject } from '@/types';
import { StatusBadge } from './StatusBadge';
import {
  Building2,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface ProjectStatusCardProps {
  project: CSRProject;
  userRole: 'NGO' | 'CORPORATE' | 'BUSINESS' | 'ADMIN';
  onOpenStatusModal?: (project: CSRProject) => void;
  onLockProject?: (project: CSRProject) => void;
}

export const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({
  project,
  userRole,
  onOpenStatusModal,
  onLockProject,
}) => {
  // Determine Payment Status Percentage
  const getPaymentPercentage = (): string => {
    if (['FINAL_40_PAID', 'COMPLETED'].includes(project.status)) return '100%';
    if (['MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED'].includes(project.status)) return '60%';
    if (['ADVANCE_20_PAID', 'IN_PROGRESS', 'FULFILLMENT_SUBMITTED'].includes(project.status)) return '20%';
    return '0%';
  };

  // Determine Tender Status
  const getTenderStatus = (): string => {
    if (!project.tender_id) {
      if (['DRAFT', 'AI_ANALYZING', 'NGO_REVIEW', 'SUBMITTED'].includes(project.status)) return 'NOT_CREATED';
      if (project.status === 'CORPORATE_INTERESTED') return 'NOT_RELEASED';
      return 'NOT_CREATED';
    }
    if (project.status === 'TENDER_OPEN') return 'OPEN';
    if (project.status === 'TENDER_CLOSED') return 'CLOSED';
    if (project.status === 'AI_EVALUATED') return 'AI_COMPARISON_READY';
    if (['BUSINESS_SELECTED', 'CONTRACTED'].includes(project.status)) return 'SELECTED';
    return 'FINALIZED';
  };

  // Determine Delivery Status
  const getDeliveryStatus = (): string => {
    if (['COMPLETED', 'FINAL_40_PAID', 'NGO_CONFIRMED'].includes(project.status)) return 'NGO_CONFIRMED';
    if (project.status === 'NGO_CONFIRMATION_PENDING') return 'NGO_CONFIRMATION_PENDING';
    if (['FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID'].includes(project.status)) return 'SUBMITTED';
    if (['ADVANCE_20_PAID', 'IN_PROGRESS'].includes(project.status)) return 'IN_PROGRESS';
    if (project.status === 'MANUAL_REVIEW') return 'ISSUE_RAISED';
    return 'NOT_STARTED';
  };

  // Determine Next Action text
  const getNextAction = (): string => {
    switch (project.status) {
      case 'DRAFT':
        return 'Submit requirement for Featherless AI structuring';
      case 'AI_ANALYZING':
        return 'Featherless AI structuring in progress...';
      case 'NGO_REVIEW':
        return userRole === 'NGO' ? 'Review & Approve AI Requirement Report' : 'Awaiting NGO approval';
      case 'SUBMITTED':
        return userRole === 'CORPORATE' ? 'Review requirement & Lock Project' : 'Awaiting Corporate lock';
      case 'CORPORATE_INTERESTED':
        return userRole === 'CORPORATE' ? 'Create & publish procurement tender' : 'Corporate preparing tender';
      case 'TENDER_OPEN':
        return userRole === 'BUSINESS' ? 'Submit competitive quotation' : 'Accepting vendor bids';
      case 'TENDER_CLOSED':
      case 'AI_EVALUATED':
        return userRole === 'CORPORATE' ? 'Review AI comparison & select vendor' : 'AI comparison ready';
      case 'BUSINESS_SELECTED':
      case 'CONTRACTED':
        return userRole === 'CORPORATE' ? 'Release 20% Advance Payment' : 'Awaiting 20% advance release';
      case 'ADVANCE_20_PAID':
      case 'IN_PROGRESS':
        return userRole === 'BUSINESS' ? 'Execute contract & upload delivery proof' : 'Vendor executing delivery';
      case 'FULFILLMENT_SUBMITTED':
        return userRole === 'CORPORATE' ? 'Review proof & release 40% milestone' : 'Fulfillment proof under review';
      case 'MILESTONE_40_PAID':
      case 'NGO_CONFIRMATION_PENDING':
        return userRole === 'NGO' ? 'Conduct physical inspection & confirm receiving' : 'Waiting for NGO ground verification';
      case 'NGO_CONFIRMED':
        return userRole === 'CORPORATE' ? 'Release Final 40% payment' : 'Awaiting final payment release';
      case 'FINAL_40_PAID':
      case 'COMPLETED':
        return 'Project complete — View Verifiable Impact Report';
      default:
        return 'View status details';
    }
  };

  const paymentPct = getPaymentPercentage();
  const tenderSt = getTenderStatus();
  const deliverySt = getDeliveryStatus();
  const nextAction = getNextAction();
  const contractVal = project.contract_value || project.estimated_budget;

  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-teal-700">{project.project_code}</span>
            <StatusBadge status={project.status} size="sm" />
          </div>
          <h3 className="font-bold text-slate-900 text-base leading-snug">{project.title}</h3>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Budget / Value</span>
          <span className="font-mono font-bold text-slate-900 text-sm">₹{contractVal.toLocaleString()}</span>
        </div>
      </div>

      {/* Role Partner Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
          <Building2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          <div className="truncate">
            <span className="text-[9px] text-slate-400 uppercase font-mono block">NGO Partner</span>
            <span className="font-semibold text-slate-800 truncate">{project.ngo_organization?.name || 'NGO Partner'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
          <div className="truncate">
            <span className="text-[9px] text-slate-400 uppercase font-mono block">Corporate</span>
            <span className="font-semibold text-slate-800 truncate">
              {project.corporate_organization?.name || (project.status === 'SUBMITTED' ? 'Available' : 'Apex Tech')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
          <Briefcase className="h-3.5 w-3.5 text-purple-600 shrink-0" />
          <div className="truncate">
            <span className="text-[9px] text-slate-400 uppercase font-mono block">Selected Vendor</span>
            <span className="font-semibold text-slate-800 truncate">
              {project.business_organization?.name || 'Tender In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Status Matrix */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-mono block">Tender Stage</span>
          <span className="font-bold text-slate-800 text-[11px] uppercase">{tenderSt.replace(/_/g, ' ')}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-mono block">Disbursed (20/40/40)</span>
          <span className="font-bold text-teal-700 font-mono text-[11px]">{paymentPct} Paid</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-mono block">Delivery / Check</span>
          <span className="font-bold text-slate-800 text-[11px] uppercase">{deliverySt.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Next Action Box */}
      <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200 text-xs flex items-start gap-2">
        <Clock className="h-4 w-4 text-teal-700 mt-0.5 shrink-0" />
        <div className="flex-1">
          <span className="text-[10px] uppercase font-bold text-teal-900 block font-mono">Next Action Required:</span>
          <span className="font-semibold text-teal-900">{nextAction}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-1 flex items-center justify-between gap-3">
        {project.status === 'SUBMITTED' && userRole === 'CORPORATE' && onLockProject ? (
          <button
            onClick={() => onLockProject(project)}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Lock Project for CSR</span>
          </button>
        ) : onOpenStatusModal ? (
          <button
            onClick={() => onOpenStatusModal(project)}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
          >
            <span>View Full Status & Actions</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href={
              userRole === 'NGO'
                ? `/ngo/projects/${project.id}`
                : userRole === 'CORPORATE'
                ? `/corporate/projects/${project.id}`
                : `/business/projects/${project.id}/fulfillment`
            }
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
          >
            <span>View Project Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
};
