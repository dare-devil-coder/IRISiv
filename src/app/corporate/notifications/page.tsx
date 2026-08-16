'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { Bell, CheckCircle2, Clock, Cpu, IndianRupee, PackageCheck, AlertTriangle } from 'lucide-react';

const CORP_NOTIFS = [
  {
    id: 'cn1',
    title: 'NGO Physical Ground Confirmation Received — Final 40% Ready',
    desc: 'Shiksha Foundation verified 100% receipt for CSR-1025 (Nutrition Kits). Final 40% payment (₹23,200) can now be released.',
    time: '25 mins ago',
    type: 'PAYMENT',
  },
  {
    id: 'cn2',
    title: 'Vendor Submitted Fulfillment Evidence — 40% Milestone Triggered',
    desc: 'GreenGrow Educational Supplies uploaded invoice and signed delivery challans for CSR-1024. Release 40% milestone.',
    time: '2 hours ago',
    type: 'DELIVERY',
  },
  {
    id: 'cn3',
    title: 'Tender Closed — Featherless AI Quotation Scoring Ready',
    desc: 'Tender TND-1021 for Clean Drinking Water Systems received 3 vendor quotations. AI multi-factor scores ready for review.',
    time: '1 day ago',
    type: 'AI',
  },
  {
    id: 'cn4',
    title: 'New Verified NGO Requirement Submitted',
    desc: 'Shiksha Foundation India submitted requirement: Digital Learning Center for Rural School (Budget: ₹2,00,000).',
    time: '2 days ago',
    type: 'NEW_NEED',
  },
];

export default function CorporateNotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-indigo-600" />
            Company CSR Operational Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time triggers for tender closures, AI scoring matrices, delivery proofs, and milestone payment authorizations</p>
        </div>

        <div className="space-y-3">
          {CORP_NOTIFS.map((n) => (
            <div key={n.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 mt-0.5">
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

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
