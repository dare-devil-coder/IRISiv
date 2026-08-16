'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { DEMO_CREDENTIALS, DEMO_ORGANIZATIONS } from '@/lib/constants/demo';
import { Users, ShieldCheck, Mail, Building2 } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="ADMIN" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
              ADMIN PORTAL
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">User Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-slate-800" />
            Registered Users Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authenticated profiles and credential registry across all 4 stakeholder roles.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-500">
                <th className="p-3.5">User</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Organization</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_CREDENTIALS.map((p) => {
                const org = ('organizationId' in p && p.organizationId) ? DEMO_ORGANIZATIONS.find((o) => o.id === p.organizationId) : null;
                return (
                  <tr key={p.profileId} className="hover:bg-slate-50/60">
                    <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3.5 text-slate-600 font-mono">{p.email}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800">
                        {p.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700">{org?.name || 'IRISiv Compliance Platform'}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ACTIVE ✓
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
