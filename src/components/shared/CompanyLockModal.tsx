'use client';

import React, { useState } from 'react';
import { CSRProject } from '@/types';
import { ShieldCheck, X, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';

interface CompanyLockModalProps {
  project: CSRProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CompanyLockModal: React.FC<CompanyLockModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const handleConfirmLock = async () => {
    setLocking(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corporate_organization_id: 'org-corp-1' }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to lock project');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLocking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Lock CSR Project</h3>
              <p className="text-xs text-slate-500">{project.project_code} — {project.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
          <p className="font-bold text-slate-900">You are about to lock this CSR project:</p>
          <ul className="space-y-1 text-slate-600 list-disc list-inside">
            <li>Apex Global Technologies will become the official sponsoring corporate.</li>
            <li>Project status will transition to <strong>ONGOING</strong>.</li>
            <li>You can immediately create and publish a procurement tender for vendors.</li>
            <li>The NGO (<strong>{project.ngo_organization?.name || 'Shiksha Foundation'}</strong>) will be notified immediately.</li>
          </ul>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={locking}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLock}
            disabled={locking}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
          >
            {locking ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            <span>Confirm Project Lock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
