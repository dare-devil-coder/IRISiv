'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { Bell, CheckCircle2, Clock, Cpu, ShieldCheck, Briefcase, IndianRupee } from 'lucide-react';

const NGO_NOTIFS = [
  {
    id: 'n1',
    title: 'Physical Ground Delivery Verification Required',
    desc: 'GreenGrow Educational Supplies delivered 500 units for Project CSR-1024. Please perform physical inspection and confirm receipt on the ground.',
    time: '10 mins ago',
    type: 'ACTION_REQUIRED',
  },
  {
    id: 'n2',
    title: 'Corporate Sponsor Locked Your CSR Requirement',
    desc: 'Apex Global Technologies has locked CSR-1028 (Digital Learning Center) and is preparing the procurement tender.',
    time: '2 hours ago',
    type: 'MILESTONE',
  },
  {
    id: 'n3',
    title: 'Featherless AI Need Analysis Structured',
    desc: 'AI generated feasibility score (94/100) and budget validation for requirement: Educational STEM Kits.',
    time: '1 day ago',
    type: 'AI',
  },
  {
    id: 'n4',
    title: 'Project Completed & Verified Impact Certificate Generated',
    desc: 'CSR-1025 (Nutrition Kits) successfully completed. MCA Schedule VII audit report is now available for download.',
    time: '3 days ago',
    type: 'COMPLETED',
  },
];

export default function NGONotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="NGO" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-teal-600" />
            NGO Operational Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time alerts for requirement approvals, corporate locks, vendor deliveries, and impact milestones</p>
        </div>

        <div className="space-y-3">
          {NGO_NOTIFS.map((n) => (
            <div key={n.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 mt-0.5">
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

      <AIAssistantDrawer currentRole="NGO" />
    </div>
  );
}
