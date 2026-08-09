import React from 'react';
import { Payment } from '@/types';
import { CheckCircle2, Clock, Circle, IndianRupee } from 'lucide-react';

interface PaymentMilestoneTrackerProps {
  payments: Payment[];
  contractValue: number;
}

export const PaymentMilestoneTracker: React.FC<PaymentMilestoneTrackerProps> = ({ payments, contractValue }) => {
  const advance = payments.find((p) => p.payment_type === 'ADVANCE_20' || p.payment_type === 'ADVANCE' as any);
  const milestone = payments.find((p) => p.payment_type === 'FULFILLMENT_40');
  const final = payments.find((p) => p.payment_type === 'FINAL_40' || p.payment_type === 'FINAL' as any);

  const advanceAmt = advance?.amount ?? Math.round(contractValue * 0.2);
  const milestoneAmt = milestone?.amount ?? Math.round(contractValue * 0.4);
  const finalAmt = final?.amount ?? Math.round(contractValue * 0.4);
  const totalPaid = (advance ? advanceAmt : 0) + (milestone ? milestoneAmt : 0) + (final ? finalAmt : 0);
  const progressPct = contractValue > 0 ? Math.round((totalPaid / contractValue) * 100) : 0;

  const milestones = [
    { label: '20% Advance', amount: advanceAmt, payment: advance, trigger: 'Contract execution', color: 'teal' },
    { label: '40% Fulfillment', amount: milestoneAmt, payment: milestone, trigger: 'Delivery proof submitted', color: 'indigo' },
    { label: '40% Final', amount: finalAmt, payment: final, trigger: 'NGO physical confirmation', color: 'emerald' },
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-teal-600" />
            20 / 40 / 40 Payment Milestones
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Contract Value: ₹{contractValue.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-black text-slate-900 font-mono">₹{totalPaid.toLocaleString()}</div>
          <div className="text-xs text-slate-500">{progressPct}% disbursed</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>₹0</span>
          <span>₹{Math.round(contractValue * 0.2).toLocaleString()} (20%)</span>
          <span>₹{Math.round(contractValue * 0.6).toLocaleString()} (60%)</span>
          <span>₹{contractValue.toLocaleString()} (100%)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {milestones.map((m, idx) => {
          const isRecorded = !!m.payment;
          const isPending = !isRecorded && idx === milestones.filter((x) => !!x.payment).length;
          return (
            <div
              key={m.label}
              className={`p-4 rounded-xl border text-xs ${
                isRecorded
                  ? 'bg-emerald-50 border-emerald-200'
                  : isPending
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold ${
                  isRecorded ? 'text-emerald-800' : isPending ? 'text-amber-900' : 'text-slate-600'
                }`}>{m.label}</span>
                {isRecorded ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : isPending ? (
                  <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-300" />
                )}
              </div>
              <div className={`text-base font-black font-mono ${
                isRecorded ? 'text-emerald-900' : isPending ? 'text-amber-900' : 'text-slate-400'
              }`}>
                ₹{m.amount.toLocaleString()}
              </div>
              <div className={`mt-1 ${
                isRecorded ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                {isRecorded ? 'RECORDED' : `Trigger: ${m.trigger}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
