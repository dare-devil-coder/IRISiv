'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject, AuditLog, Organization } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  ShieldAlert,
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  FileText,
  Clock,
  Filter,
  Search,
  Check,
  X,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'KYC' | 'ORGS' | 'PROJECTS' | 'AUDIT'>('KYC');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal State
  const [rejectModalOrg, setRejectModalOrg] = useState<Organization | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [oRes, pRes, aRes] = await Promise.all([
        fetch('/api/admin/kyc').catch(() => null),
        fetch('/api/projects').catch(() => null),
        fetch('/api/admin/audit-logs').catch(() => null),
      ]);

      if (oRes && oRes.ok) {
        const oJson = await oRes.json();
        if (oJson.success) setOrganizations(oJson.data);
      }
      if (pRes && pRes.ok) {
        const pJson = await pRes.json();
        if (pJson.success) setProjects(pJson.data);
      }
      if (aRes && aRes.ok) {
        const aJson = await aRes.json();
        if (aJson.success) setAuditLogs(aJson.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveKYC = async (orgId: string) => {
    setProcessingId(orgId);
    try {
      const res = await fetch(`/api/admin/kyc/${orgId}/approve`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setOrganizations((prev) =>
          prev.map((o) => (o.id === orgId ? { ...o, kyc_status: 'ACTIVE', verification_status: 'VERIFIED' } : o))
        );
      }
    } catch {
      alert('Failed to approve KYC');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectKYC = async () => {
    if (!rejectModalOrg) return;
    setProcessingId(rejectModalOrg.id);
    try {
      const res = await fetch(`/api/admin/kyc/${rejectModalOrg.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const json = await res.json();
      if (json.success) {
        setOrganizations((prev) =>
          prev.map((o) =>
            o.id === rejectModalOrg.id
              ? { ...o, kyc_status: 'KYC_REJECTED', verification_status: 'REJECTED', rejection_reason: rejectReason }
              : o
          )
        );
        setRejectModalOrg(null);
        setRejectReason('');
      }
    } catch {
      alert('Failed to reject KYC');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingKYC = organizations.filter((o) => o.kyc_status === 'KYC_PENDING' || o.verification_status === 'DOCUMENTS_SUBMITTED');
  const activeOrgs = organizations.filter((o) => o.kyc_status === 'ACTIVE' || o.verification_status === 'VERIFIED');
  const rejectedOrgs = organizations.filter((o) => o.kyc_status === 'KYC_REJECTED' || o.verification_status === 'REJECTED');
  const activeProjects = projects.filter((p) => !['COMPLETED', 'REJECTED'].includes(p.status));
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="ADMIN" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <ShieldAlert className="h-6 w-6 text-teal-600" />
              Platform Administration & KYC Compliance
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify organizational credentials, review legal documentation, and inspect immutable audit logs
            </p>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh System State</span>
          </button>
        </div>

        {/* Top KPI Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-800 block">Pending KYC</span>
            <div className="text-2xl font-black text-amber-950 font-mono mt-1">{pendingKYC.length}</div>
            <span className="text-[10px] text-amber-700">Requires Review</span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 block">Verified Orgs</span>
            <div className="text-2xl font-black text-emerald-950 font-mono mt-1">{activeOrgs.length}</div>
            <span className="text-[10px] text-emerald-700">Active Entities</span>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
            <span className="text-[10px] uppercase font-mono font-bold text-rose-800 block">Rejected / Corrections</span>
            <div className="text-2xl font-black text-rose-950 font-mono mt-1">{rejectedOrgs.length}</div>
            <span className="text-[10px] text-rose-700">Action Needed</span>
          </div>

          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50">
            <span className="text-[10px] uppercase font-mono font-bold text-teal-800 block">Active Projects</span>
            <div className="text-2xl font-black text-teal-950 font-mono mt-1">{activeProjects.length}</div>
            <span className="text-[10px] text-teal-700">In Workflow</span>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
            <span className="text-[10px] uppercase font-mono font-bold text-indigo-800 block">Open Tenders</span>
            <div className="text-2xl font-black text-indigo-950 font-mono mt-1">
              {projects.filter((p) => p.status === 'TENDER_OPEN').length}
            </div>
            <span className="text-[10px] text-indigo-700">Accepting Bids</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Completed Projects</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{completedProjects.length}</div>
            <span className="text-[10px] text-slate-500">100% Verified</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'KYC', label: `Pending KYC Applications (${pendingKYC.length})`, icon: Clock },
            { id: 'ORGS', label: `All Organizations (${organizations.length})`, icon: Building2 },
            { id: 'PROJECTS', label: `Projects & Tenders (${projects.length})`, icon: FileText },
            { id: 'AUDIT', label: `Immutable Audit Trail (${auditLogs.length})`, icon: ShieldAlert },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === t.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: KYC APPLICATIONS */}
        {activeTab === 'KYC' && (
          <div className="space-y-4">
            {pendingKYC.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900">All KYC Applications Reviewed</h3>
                <p className="text-xs text-slate-500 mt-1">No organization verification requests are currently pending.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingKYC.map((org) => (
                  <div key={org.id} className="p-5 rounded-2xl border border-amber-200 bg-white shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                            {org.organization_type}
                          </span>
                          <StatusBadge status="KYC_PENDING" size="sm" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{org.name}</h3>
                        <p className="text-xs text-slate-500">{org.location} • {org.phone}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Domain:</span>
                        <span className="font-semibold text-slate-800">{org.domain || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reg / CIN / GSTIN:</span>
                        <span className="font-mono font-bold text-slate-800">{org.registration_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tax ID / PAN:</span>
                        <span className="font-mono font-bold text-slate-800">{org.tax_id || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleApproveKYC(org.id)}
                        disabled={processingId === org.id}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        {processingId === org.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        <span>Approve KYC</span>
                      </button>

                      <button
                        onClick={() => {
                          setRejectModalOrg(org);
                          setRejectReason('');
                        }}
                        disabled={processingId === org.id}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs transition"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Reject with Reason</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORGANIZATIONS DIRECTORY */}
        {activeTab === 'ORGS' && (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase">
                  <th className="p-3.5">Organization</th>
                  <th className="p-3.5">Type & Domain</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Registration / PAN</th>
                  <th className="p-3.5">KYC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5 font-bold text-slate-900">{org.name}</td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700">{org.organization_type}</span>
                      <span className="block text-[10px] text-slate-400">{org.domain || '—'}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">{org.location || '—'}</td>
                    <td className="p-3.5 font-mono text-slate-600">{org.tax_id || org.registration_number || '—'}</td>
                    <td className="p-3.5">
                      <StatusBadge status={org.kyc_status || 'ACTIVE'} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: PROJECTS & TENDERS */}
        {activeTab === 'PROJECTS' && (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase">
                  <th className="p-3.5">Project</th>
                  <th className="p-3.5">NGO Partner</th>
                  <th className="p-3.5">Corporate</th>
                  <th className="p-3.5">Budget</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{p.title}</span>
                      <span className="font-mono text-[10px] text-teal-700">{p.project_code}</span>
                    </td>
                    <td className="p-3.5 text-slate-700">{p.ngo_organization?.name || '—'}</td>
                    <td className="p-3.5 text-slate-700">{p.corporate_organization?.name || 'Open'}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      ₹{(p.contract_value || p.estimated_budget).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'AUDIT' && (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase">
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Actor & Role</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Target / Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800">{log.actor_role || 'SYSTEM'}</span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-teal-700">{log.action}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-600">
                      {JSON.stringify(log.metadata || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REJECT KYC MODAL */}
        {rejectModalOrg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Reject KYC Application</h3>
                <button onClick={() => setRejectModalOrg(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Provide an explicit reason for rejecting <strong>{rejectModalOrg.name}</strong>. The organization will be notified to make corrections.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Rejection Reason</label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. 12A registration certificate missing authorized seal and signatory date..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOrg(null)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectKYC}
                  disabled={!rejectReason.trim() || processingId === rejectModalOrg.id}
                  className="flex-1 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
