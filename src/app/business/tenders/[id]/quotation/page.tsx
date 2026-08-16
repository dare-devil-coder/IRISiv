'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Tender } from '@/types';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  Briefcase,
  FileText,
  IndianRupee,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Clock,
} from 'lucide-react';

export default function BusinessQuotationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryTimelineDays, setDeliveryTimelineDays] = useState('20');
  const [productionCapacity, setProductionCapacity] = useState('High (1,000 units/week)');
  const [experienceYears, setExperienceYears] = useState('7');
  const [technicalSpecifications, setTechnicalSpecifications] = useState('Full compliance with technical specifications. Premium ISO certified components with 2-year warranty.');
  const [warrantyDetails, setWarrantyDetails] = useState('24-month comprehensive replacement warranty with local on-site technician support.');
  const [docUploaded, setDocUploaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tenders/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTender(json.data);
          const bg = json.data.max_budget || json.data.budget || 150000;
          setBidAmount(String(Math.round(bg * 0.92)));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || !deliveryTimelineDays) {
      setError('Please provide a bid amount and delivery timeline.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/tenders/${id}/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_organization_id: 'org-biz-1',
          bid_amount: Number(bidAmount),
          delivery_timeline_days: Number(deliveryTimelineDays),
          item_specifications: technicalSpecifications,
          production_capacity: productionCapacity,
          relevant_experience_years: Number(experienceYears),
          warranty_details: warrantyDetails,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to submit quotation');

      router.push('/business/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentRole="BUSINESS" />
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentRole="BUSINESS" />
        <div className="max-w-xl mx-auto py-16 text-center">
          <h2 className="text-lg font-bold text-slate-900">Tender Not Found</h2>
          <Link href="/business/dashboard" className="text-xs text-purple-700 font-bold hover:underline mt-2 inline-block">
            ← Return to Business Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tenderBudget = tender.max_budget || tender.budget || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/business/dashboard" className="text-xs font-mono text-slate-500 hover:text-slate-900">
              Dashboard
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-xs font-mono font-bold text-purple-700">{tender.tender_code}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-purple-600" />
            Submit Blind Procurement Quotation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quotations are sealed and scored across 7 factors by Featherless AI upon tender closing
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tender Reference Card */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3 text-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Tender Subject</span>
              <h3 className="font-bold text-slate-900 text-base">{tender.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Ceiling Budget</span>
              <span className="font-mono font-bold text-slate-900 text-sm">₹{tenderBudget.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-slate-600">{tender.description}</p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-mono block">Required Quantity</span>
              <span className="font-bold text-slate-800">{tender.target_quantity} {tender.target_unit || 'units'}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-mono block">Delivery Deadline</span>
              <span className="font-bold text-slate-800">{tender.delivery_deadline_days} Days Max</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-mono block">Payment Terms</span>
              <span className="font-bold text-teal-700">20 / 40 / 40 Escrow</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-mono block">Domain Category</span>
              <span className="font-bold text-slate-800">{tender.business_domain || 'General'}</span>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Your Quoted Bid Amount (₹ INR)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="135000"
                  className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 font-mono font-bold text-slate-900"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Must not exceed ceiling budget of ₹{tenderBudget.toLocaleString()}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Committed Delivery Timeline (Days)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  required
                  value={deliveryTimelineDays}
                  onChange={(e) => setDeliveryTimelineDays(e.target.value)}
                  placeholder="20"
                  className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Production / Fulfillment Capacity</label>
              <input
                type="text"
                required
                value={productionCapacity}
                onChange={(e) => setProductionCapacity(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Relevant Experience (Years)</label>
              <input
                type="number"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Technical Specifications & Scope Offer</label>
            <textarea
              required
              rows={3}
              value={technicalSpecifications}
              onChange={(e) => setTechnicalSpecifications(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Warranty & Service SLA</label>
            <input
              type="text"
              required
              value={warrantyDetails}
              onChange={(e) => setWarrantyDetails(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Proposal Dossier / Catalog Upload</label>
            <div
              onClick={() => setDocUploaded(!docUploaded)}
              className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition ${
                docUploaded
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950'
                  : 'border-slate-300 hover:border-purple-500 bg-slate-50'
              }`}
            >
              {docUploaded ? (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Proposal_Quotation_Dossier.pdf attached (Click to remove)</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                  <Upload className="h-4 w-4 text-slate-400" />
                  <span>Attach Technical Proposal & Quotation Breakdown (PDF up to 10MB)</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              <span>Submit Sealed Quotation</span>
            </button>
          </div>
        </form>
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
