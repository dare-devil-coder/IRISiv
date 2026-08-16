'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { Bell, CheckCircle2, Clock, IndianRupee, PackageCheck, AlertTriangle } from 'lucide-react';

const BIZ_NOTIFS = [
  {
    id: 'bn1',
    title: '40% Fulfillment Milestone Payment Released (₹46,400)',
    desc: 'Apex Global Technologies authorized the 40% milestone payment for CSR-1025 following delivery proof verification.',
    time: '15 mins ago',
    type: 'PAYMENT',
  },
  {
    id: 'bn2',
    title: 'Quotation Selected! CSR Contract Established',
    desc: 'Congratulations! Apex Global Technologies selected your quotation for CSR-1028. 20% advance payment is being prepared.',
    time: '1 day ago',
    type: 'WIN',
  },
  {
    id: 'bn3',
    title: 'New Matching Tender: Clean Drinking Water RO Systems',
    desc: 'A new tender TND-1021 matching your business domain has been opened by Apex Global Technologies. Ceiling budget: ₹1,50,000.',
    time: '3 days ago',
    type: 'TENDER',
  },
];

export default function BusinessNotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-purple-600" />
            Vendor Tender & Payment Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time alerts for domain-matched tenders, contract awards, and 20/40/40 milestone payouts</p>
        </div>

        <div className="space-y-3">
          {BIZ_NOTIFS.map((n) => (
            <div key={n.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 mt-0.5">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs">{n.title}</h3>
                  <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
