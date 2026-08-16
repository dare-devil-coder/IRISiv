import { ProjectStatus } from '@/types';

// ─── New 24-state transition graph for IRISiv ──────────────────────────────────
// Lifecycle: DRAFT → AI_ANALYZING → NGO_REVIEW → SUBMITTED → CORPORATE_REVIEW
//   → CORPORATE_INTERESTED → TENDER_OPEN → TENDER_CLOSED → AI_EVALUATED
//   → BUSINESS_SELECTED → CONTRACTED → ADVANCE_20_PAID → IN_PROGRESS
//   → FULFILLMENT_SUBMITTED → MILESTONE_40_PAID → NGO_CONFIRMATION_PENDING
//   → NGO_CONFIRMED → FINAL_40_PAID → COMPLETED
const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  DRAFT: ['AI_ANALYZING', 'NGO_REVIEW', 'SUBMITTED'],
  AI_ANALYZING: ['NGO_REVIEW', 'SUBMITTED', 'DRAFT'],
  NGO_REVIEW: ['SUBMITTED', 'DRAFT', 'AI_ANALYZING'],
  SUBMITTED: ['CORPORATE_REVIEW', 'CORPORATE_INTERESTED', 'REJECTED', 'DRAFT'],
  CORPORATE_REVIEW: ['CORPORATE_INTERESTED', 'REJECTED', 'SUBMITTED'],
  CORPORATE_INTERESTED: ['TENDER_OPEN', 'REJECTED'],
  TENDER_OPEN: ['TENDER_CLOSED', 'CANCELLED', 'EXPIRED'],
  TENDER_CLOSED: ['AI_EVALUATED', 'CANCELLED'],
  AI_EVALUATED: ['BUSINESS_SELECTED', 'TENDER_OPEN'],
  BUSINESS_SELECTED: ['CONTRACTED', 'CANCELLED'],
  CONTRACTED: ['ADVANCE_20_PAID'],
  ADVANCE_20_PAID: ['IN_PROGRESS', 'FULFILLMENT_SUBMITTED'],
  IN_PROGRESS: ['FULFILLMENT_SUBMITTED', 'CANCELLED'],
  FULFILLMENT_SUBMITTED: ['MILESTONE_40_PAID', 'NGO_CONFIRMED', 'MANUAL_REVIEW', 'DISPUTED'],
  MILESTONE_40_PAID: ['NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'],
  NGO_CONFIRMATION_PENDING: ['NGO_CONFIRMED', 'DISPUTED', 'MANUAL_REVIEW'],
  NGO_CONFIRMED: ['FINAL_40_PAID', 'COMPLETED'],
  FINAL_40_PAID: ['COMPLETED'],
  COMPLETED: [],
  // Exception states
  MANUAL_REVIEW: ['NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED', 'DISPUTED'],
  DISPUTED: ['MANUAL_REVIEW', 'NGO_CONFIRMED', 'CANCELLED'],
  REJECTED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export class StateMachineService {
  static canTransition(currentStatus: ProjectStatus, requestedStatus: ProjectStatus): boolean {
    if (currentStatus === requestedStatus) return true;
    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    return allowed.includes(requestedStatus);
  }

  static assertTransition(currentStatus: ProjectStatus, requestedStatus: ProjectStatus): void {
    if (!this.canTransition(currentStatus, requestedStatus)) {
      throw new Error(
        `Invalid state transition: Cannot move project from '${currentStatus}' to '${requestedStatus}'. ` +
        `Allowed next states: [${(VALID_TRANSITIONS[currentStatus] || []).join(', ') || 'none'}]`
      );
    }
  }

  // Returns 0–18 for the 19-step lifecycle progress bar
  static getStepIndex(status: ProjectStatus): number {
    const stepMap: Record<ProjectStatus, number> = {
      DRAFT: 0,
      AI_ANALYZING: 1,
      NGO_REVIEW: 2,
      SUBMITTED: 3,
      CORPORATE_REVIEW: 4,
      CORPORATE_INTERESTED: 5,
      TENDER_OPEN: 6,
      TENDER_CLOSED: 7,
      AI_EVALUATED: 8,
      BUSINESS_SELECTED: 9,
      CONTRACTED: 10,
      ADVANCE_20_PAID: 11,
      IN_PROGRESS: 12,
      FULFILLMENT_SUBMITTED: 13,
      MILESTONE_40_PAID: 14,
      NGO_CONFIRMATION_PENDING: 15,
      NGO_CONFIRMED: 16,
      FINAL_40_PAID: 17,
      COMPLETED: 18,
      // Exception states mapped to nearest visible position
      MANUAL_REVIEW: 13,
      DISPUTED: 13,
      REJECTED: 3,
      CANCELLED: 6,
      EXPIRED: 6,
    };
    return stepMap[status] ?? 0;
  }

  static isTerminalState(status: ProjectStatus): boolean {
    return ['COMPLETED', 'REJECTED', 'CANCELLED', 'EXPIRED'].includes(status);
  }

  static isExceptionState(status: ProjectStatus): boolean {
    return ['MANUAL_REVIEW', 'DISPUTED', 'REJECTED', 'CANCELLED', 'EXPIRED'].includes(status);
  }

  // Returns the human-readable label for each state
  static getStateLabel(status: ProjectStatus): string {
    const labels: Record<ProjectStatus, string> = {
      DRAFT: 'Draft',
      AI_ANALYZING: 'AI Analyzing',
      NGO_REVIEW: 'NGO Review',
      SUBMITTED: 'Submitted',
      CORPORATE_REVIEW: 'Corporate Review',
      CORPORATE_INTERESTED: 'Corporate Interested',
      TENDER_OPEN: 'Tender Open',
      TENDER_CLOSED: 'Tender Closed',
      AI_EVALUATED: 'AI Evaluated',
      BUSINESS_SELECTED: 'Business Selected',
      CONTRACTED: 'Contracted',
      ADVANCE_20_PAID: '20% Advance Recorded',
      IN_PROGRESS: 'In Progress',
      FULFILLMENT_SUBMITTED: 'Fulfillment Submitted',
      MILESTONE_40_PAID: '40% Milestone Recorded',
      NGO_CONFIRMATION_PENDING: 'NGO Confirmation Pending',
      NGO_CONFIRMED: 'NGO Confirmed',
      FINAL_40_PAID: '40% Final Recorded',
      COMPLETED: 'Completed',
      MANUAL_REVIEW: '⚠ Manual Review Required',
      DISPUTED: '⚠ Disputed',
      REJECTED: 'Rejected',
      CANCELLED: 'Cancelled',
      EXPIRED: 'Expired',
    };
    return labels[status] ?? status.replace(/_/g, ' ');
  }
}
