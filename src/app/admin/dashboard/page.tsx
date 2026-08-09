'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject, AuditLog } from '@/types';
import {
  BarChart3,
  RefreshCw,
  Loader2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Briefcase,
  GitCommit,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/admin/audit-logs'),
      ]);
      if (pRes.ok) {
        const pJson = await pRes.json();
        if (pJson?.success) setProjects(pJson.data);
      }
      if (aRes.ok) {
        const aJson = await aRes.json();
        if (aJson?.success) setAuditLogs(aJson.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetState = async () => {
    if (!confirm('Are you sure you want to reset the system to clean demo seed state?')) return;
    setResetting(true);
    setResetMessage(null);
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setResetMessage('System state successfully reset to seed demo data.');
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  const totalValue = projects.reduce((sum, p) => sum + (p.contract_value || p.estimated_budget), 0);
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="ADMIN" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Admin Governance Portal</h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 border border-slate-300">
                System Administrator
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Global CSR execution monitor, state machine inspector, audit trail ledger & demo reset control.</p>
          </div>

          <button
            onClick={handleResetState}
            disabled={resetting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition w-fit"
          >
            {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span>Reset to Demo Seed State</span>
          </button>
        </div>

        {resetMessage && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{resetMessage}</span>
          </div>
        )}

        {/* Global Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Total CSR Volume</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">₹{(totalValue / 100000).toFixed(1)}L</div>
            <span className="text-[11px] text-slate-500 mt-1 block">{projects.length} Total Projects</span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Completed Impact</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{completedCount}</div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Fully verified</span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">System Audit Events</span>
            <div className="text-2xl font-black text-indigo-700 font-mono mt-1">{auditLogs.length}</div>
            <span className="text-[11px] text-indigo-700 font-semibold mt-1 block">Immutable ledger</span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">AI Model Health</span>
            <div className="text-2xl font-black text-violet-700 font-mono mt-1">100%</div>
            <span className="text-[11px] text-violet-700 font-semibold mt-1 block">Featherless AI active</span>
          </div>
        </div>

        {/* System Projects Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitCommit className="h-4 w-4 text-teal-600" />
              All System Projects & State Machine Status
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500">{projects.length} Total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4 font-bold">Code</th>
                  <th className="p-4 font-bold">Project Title</th>
                  <th className="p-4 font-bold hidden sm:table-cell">NGO</th>
                  <th className="p-4 font-bold hidden md:table-cell">Budget</th>
                  <th className="p-4 font-bold">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-teal-700">{p.project_code}</td>
                    <td className="p-4 font-semibold text-slate-900">{p.title}</td>
                    <td className="p-4 text-slate-600 hidden sm:table-cell">{p.ngo_organization?.name || 'NGO Partner'}</td>
                    <td className="p-4 font-mono font-bold text-slate-900 hidden md:table-cell">₹{p.estimated_budget.toLocaleString()}</td>
                    <td className="p-4"><StatusBadge status={p.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Audit Logs */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              Audit Log Ledger ({auditLogs.length})
            </h2>
          </div>

          <div className="p-5 space-y-3 font-mono text-xs max-h-[400px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 uppercase">{log.actor_role}</span>
                  <span className="font-bold text-slate-900">{log.action}</span>
                  {log.project_id && <span className="text-teal-700 font-bold">[{log.project_id}]</span>}
                </div>
                <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AIAssistantDrawer currentRole="ADMIN" />
    </div>
  );
}
