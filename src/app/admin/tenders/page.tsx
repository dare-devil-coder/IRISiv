'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Tender } from '@/types';
import { Briefcase, Loader2, RotateCcw } from 'lucide-react';

export default function AdminTendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTenders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tenders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setTenders(json.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="ADMIN" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
                ADMIN PORTAL
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">Tender Registry</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-amber-700" />
              Platform Tenders ({tenders.length})
            </h1>
          </div>

          <button
            onClick={loadTenders}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-6 w-6 text-slate-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-500">
                  <th className="p-3.5">Tender Code & Title</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Budget Ceiling</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenders.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-900 block">{t.tender_code}</span>
                      <span className="text-slate-600">{t.title}</span>
                    </td>
                    <td className="p-3.5 text-slate-700">{t.business_domain || 'General'}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">₹{(t.max_budget || 0).toLocaleString()}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
