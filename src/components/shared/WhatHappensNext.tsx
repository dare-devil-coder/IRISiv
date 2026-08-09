import React from 'react';
import { ProjectStatus, UserRole } from '@/types';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface WhatHappensNextProps {
  status: ProjectStatus;
  userRole: UserRole;
}

const NEXT_STEPS: Partial<Record<ProjectStatus, Partial<Record<UserRole, { title: string; steps: string[] }>>>> = {
  SUBMITTED: {
    NGO: { title: 'Your project is submitted!', steps: ['Wait for a corporate sponsor to express interest', 'You will be notified when a corporate reviews your project', 'Once interested, they will create a tender for vendor selection'] },
    CORPORATE: { title: 'A new NGO requirement awaits review', steps: ['Review the project details and impact potential', 'Decide if this aligns with your CSR goals', "Click 'Express Interest' to proceed to tender creation"] },
  },
  TENDER_OPEN: {
    NGO: { title: 'Your tender is live!', steps: ['Businesses are reviewing and submitting quotations', 'Featherless AI will evaluate each quotation automatically', 'Corporate will select the best vendor and you will be notified'] },
    CORPORATE: { title: 'Tender is accepting quotations', steps: ['Monitor incoming quotations from businesses', "Close the tender when you're ready to evaluate", 'AI will score all quotations — review and select the best'] },
    BUSINESS: { title: 'Submit your quotation!', steps: ['Review the tender requirements carefully', 'Prepare a competitive bid with full specifications', 'Submit before the closing date to be considered'] },
  },
  CONTRACTED: {
    CORPORATE: { title: 'Contract established — release 20% advance', steps: ['Record the 20% advance payment to formally start the project', 'Business will be notified and can begin execution', 'Monitor project progress in your dashboard'] },
    BUSINESS: { title: 'Your contract is signed!', steps: ['Wait for the 20% advance payment to be recorded', 'Once recorded, begin project execution immediately', 'Submit fulfillment proof when work is complete'] },
  },
  ADVANCE_20_PAID: {
    BUSINESS: { title: '20% Advance received — begin execution!', steps: ['Start procuring/preparing deliverables immediately', 'Document your work with photos, invoices, and receipts', 'Submit fulfillment proof when everything is ready'] },
    NGO: { title: 'Vendor has started work', steps: ['The vendor has received their advance payment', 'Expect delivery within the contracted timeline', 'Be ready to conduct a physical inspection upon delivery'] },
  },
  FULFILLMENT_SUBMITTED: {
    NGO: { title: 'Vendor submitted fulfillment proof!', steps: ['Review the evidence and documents uploaded by the vendor', 'Conduct your physical field verification immediately', 'Submit your confirmation or report any issues'] },
    CORPORATE: { title: 'Fulfillment proof submitted — 40% milestone triggered', steps: ['Review the fulfillment evidence uploaded by the vendor', 'NGO has been notified to conduct physical verification', 'Wait for NGO confirmation before releasing final 40%'] },
  },
  NGO_CONFIRMED: {
    CORPORATE: { title: 'NGO Confirmed — Release final 40%!', steps: ['NGO physically verified the fulfillment is complete', 'Click Release Final 40% to complete the project', 'An automated impact report will be generated'] },
    NGO: { title: 'Thank you for confirming!', steps: ['The corporate is reviewing your confirmation', 'Final 40% payment will be released by corporate', 'An IRISiv verified impact certificate will be generated'] },
    BUSINESS: { title: 'NGO confirmed — awaiting final 40%!', steps: ['NGO confirmed receipt of your fulfillment', 'Corporate is releasing the final 40% payment', 'Project will be completed and impact report generated'] },
  },
  MANUAL_REVIEW: {
    CORPORATE: { title: '⚠ Manual Review Required', steps: ['Review the flagged issue in the AI verification report', 'Decide: request remaining items, or pro-rate payment', "Contact the business vendor directly to resolve", 'Release final payment once resolved'] },
    NGO: { title: '⚠ Issue flagged for review', steps: ['Your reported issue has been escalated to corporate', 'Corporate will review and take corrective action', 'You will be notified of the resolution'] },
  },
  COMPLETED: {
    NGO: { title: '🎉 Project Complete!', steps: ['Your verifiable impact certificate has been generated', 'View the impact report to see beneficiary outcomes', 'Create a new requirement for your next project'] },
    CORPORATE: { title: '🎉 CSR Project Successfully Completed!', steps: ['Download the verified impact report for your CSR records', 'Use this in your annual CSR reporting', 'Explore new NGO projects to fund'] },
    BUSINESS: { title: '🎉 Project Complete — Full Payment Released!', steps: ['All three payments (20% + 40% + 40%) have been recorded', 'Check your dashboard for new tender opportunities', 'Your completion record strengthens future quotations'] },
  },
};

export const WhatHappensNext: React.FC<WhatHappensNextProps> = ({ status, userRole }) => {
  const info = NEXT_STEPS[status]?.[userRole];
  if (!info) return null;

  return (
    <div className="w-full rounded-2xl border border-teal-200 bg-teal-50 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <ArrowRight className="h-4 w-4 text-teal-600" />
        <h4 className="text-sm font-bold text-teal-900">What Happens Next</h4>
      </div>
      <p className="text-xs font-semibold text-teal-800 mb-3">{info.title}</p>
      <div className="space-y-2">
        {info.steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {step.startsWith('⚠') ? (
              <Clock className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
            )}
            <span className="text-xs text-teal-800 leading-relaxed">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
