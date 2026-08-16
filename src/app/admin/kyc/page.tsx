'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Organization } from '@/types';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  FileText,
  Search,
  Loader2,
  Check,
  X,
} from 'lucide-react';

export default function AdminKYCManagementPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOrg, setRejectModalOrg] = useState<Organization | null>(null);
  const [rejectReason, setRejectReason] = useState('Documentation did not meet MCA / FCRA compliance criteria');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadKYC = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/kyc');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrganizations(json.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKYC();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/kyc/${id}/approve`, {
        method: 'POST',
        headers: { 'x-user-role': 'ADMIN' },
      });
      if (res.ok) {
        await loadKYC();
      }
    } catch {
      alert('Failed to approve KYC');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModalOrg) return;
    setProcessingId(rejectModalOrg.id);
    try {
      const res = await fetch(`/api/admin/kyc/${rejectModalOrg.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'ADMIN' },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (res.ok) {
        setRejectModalOrg(null);
        await loadKYC();
      }
    } catch {
      alert('Failed to reject KYC');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="ADMIN" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
                ADMIN COMPLIANCE PORTAL
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">Identity & Legal Verification Gate</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-slate-800" />
              KYC Compliance & Verification Hub
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review 80G/12A, CSR-1, PAN, and MCA filings for NGOs, Corporates, and Vendors before platform activation.
            </p>
          </div>

          <button
            onClick={loadKYC}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Organizations Table */}
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-6 w-6 text-slate-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">All Registered Organizations ({organizations.length})</h3>
              <span className="text-xs text-slate-500">Pending & Active accounts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-mono text-slate-500">
                    <th className="p-3.5">Organization</th>
                    <th className="p-3.5">Role Type</th>
                    <th className="p-3.5">Registration / PAN</th>
                    <th className="p-3.5">KYC Status</th>
                    <th className="p-3.5">Verification Score</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {organizations.map((org) => {
                    const isPending = org.kyc_status === 'KYC_PENDING';
                    const isApproved = org.kyc_status === 'KYC_APPROVED';
                    const isRejected = org.kyc_status === 'KYC_REJECTED';

                    return (
                      <tr key={org.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div>{org.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{org.id}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-800">
                            {org.type}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">
                          {org.registration_number || 'CSR-IN-88912'}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isRejected
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {org.kyc_status}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          {org.trust_score || 92} / 100
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(org.id)}
                                disabled={!!processingId}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => setRejectModalOrg(org)}
                                disabled={!!processingId}
                                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 shadow-xs transition inline-flex items-center gap-1"
                              >
                                <X className="h-3 w-3" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          {isApproved && (
                            <span className="text-[11px] font-bold text-emerald-700">Verified ✓</span>
                          )}
                          {isRejected && (
                            <span className="text-[11px] font-bold text-rose-700">Rejected (Resubmission allowed)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Reject Reason Modal */}
      {rejectModalOrg && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Reject KYC Application</h3>
              <button onClick={() => setRejectModalOrg(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please specify the compliance reason for rejecting <strong>{rejectModalOrg.name}</strong>. The applicant will be notified to resubmit corrected documents.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOrg(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!!processingId}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
