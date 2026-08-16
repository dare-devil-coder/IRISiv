'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Tender, TenderQuotation } from '@/types';
import {
  Briefcase,
  Search,
  Filter,
  IndianRupee,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Building2,
  Tag,
  Loader2,
  RotateCcw,
} from 'lucide-react';

export default function BusinessAvailableTendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadTenders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tenders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTenders(json.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenders();
  }, []);

  const domains = ['ALL', 'Education Supplies', 'Healthcare', 'Solar & Energy', 'Water & Sanitation'];

  const filteredTenders = tenders.filter((t) => {
    const matchesDomain = selectedDomain === 'ALL' || t.business_domain === selectedDomain || t.category === selectedDomain;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tender_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                BUSINESS VENDOR PORTAL
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">Domain-Matched CSR Procurement Bids</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Available CSR Tenders</h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit competitive, sealed quotations for verified Corporate CSR requirements. 20% advance upon selection.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadTenders}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/business/my-tenders"
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-xs"
            >
              My Submitted Bids →
            </Link>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0">
            <span className="text-slate-400 font-mono text-[11px] font-bold">Domain:</span>
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  selectedDomain === dom
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tenders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Tender Cards */}
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
          </div>
        ) : filteredTenders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-amber-50 border border-amber-200 text-amber-600">
              <Briefcase className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Matching Tenders Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No active tenders match your selected domain filter. Switch domain to view all tenders.
            </p>
            <button
              onClick={() => setSelectedDomain('ALL')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-sm hover:bg-amber-600"
            >
              Show All Tenders
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTenders.map((tender) => (
              <div
                key={tender.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {tender.tender_code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{tender.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      Domain: {tender.business_domain || 'General'}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      OPEN FOR BIDS
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Company Sponsor</span>
                    <p className="font-bold text-slate-800">Apex Global Technologies</p>
                    <p className="text-slate-500">Corporate CSR</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Budget Ceiling</span>
                    <p className="font-mono font-black text-slate-900 text-sm">₹{(tender.max_budget || 0).toLocaleString()}</p>
                    <p className="text-slate-500">Maximum allocation</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Deliverables</span>
                    <p className="font-bold text-slate-800">{tender.target_quantity} {tender.target_unit}</p>
                    <p className="text-slate-500">{tender.fulfillment_type || 'PRODUCT'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Submission Window</span>
                    <p className="font-bold text-slate-800">7 Days Remaining</p>
                    <p className="text-slate-500">Closing 22 Aug 2026</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500">
                    Advance Payment: <strong className="text-emerald-700">20% Upon Selection</strong> • Milestone: <strong className="text-indigo-700">40% on Delivery</strong> • Final: <strong className="text-emerald-700">40% on NGO Signoff</strong>
                  </div>

                  <Link
                    href={`/business/tenders/${tender.id}/quotation`}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Submit Sealed Quotation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
