'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { Tender } from '@/types';
import {
  ArrowLeft,
  Briefcase,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  IndianRupee,
  Cpu,
  Info,
} from 'lucide-react';

export default function SubmitQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    bid_amount: '',
    delivery_timeline_days: '',
    quantity_offered: '',
    specifications_offered: '',
    capacity: '',
    experience: '',
    description: '',
    warranty_guarantee: '1 Year Full On-site Warranty & Technical Support',
    terms: '20% Advance on contract, 40% on fulfillment proof, 40% on NGO confirmation',
  });

  useEffect(() => {
    fetch(`/api/tenders/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTender(json.data);
          setForm((f) => ({
            ...f,
            bid_amount: String(json.data.budget),
            delivery_timeline_days: String(json.data.delivery_timeline_days || 30),
            quantity_offered: String(json.data.required_quantity),
            specifications_offered: json.data.minimum_specifications || '',
            capacity: 'Production capacity of 5,000 units/month with ISO-9001 certified QA',
            experience: '8+ years supplying educational & CSR deliverables across Gujarat & Maharashtra',
            description: `Official quotation for ${json.data.title}. All items comply fully with minimum technical specifications.`,
          }));
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bid_amount || !form.delivery_timeline_days || !form.quantity_offered || !form.description) {
      setError('Please fill in all required fields (Bid Amount, Timeline, Quantity, Description).');
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
          ...form,
          bid_amount: Number(form.bid_amount),
          delivery_timeline_days: Number(form.delivery_timeline_days),
          quantity_offered: Number(form.quantity_offered),
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to submit quotation');

      setSuccess('Quotation submitted successfully! Featherless AI has evaluated your bid.');
      setTimeout(() => router.push('/business/dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">Tender Not Found</p>
          <Link href="/business/dashboard" className="text-xs text-indigo-600 font-bold mt-2 inline-block">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/business/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Business Dashboard
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-indigo-700">{tender.tender_code}</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300">OPEN TENDER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Submit Blind Quotation</h1>
          <p className="text-xs text-slate-600 mt-1">
            Your quotation will be evaluated by Featherless AI on 7 factors (Price, Specs, Timeline, Capacity, Experience, Feasibility, Verification).
          </p>
        </div>

        {/* Tender Summary Box */}
        <div className="mb-6 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">{tender.title}</h2>
          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Target Budget</span>
              <span className="font-bold text-slate-900">₹{tender.budget.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Required Quantity</span>
              <span className="font-bold text-slate-900">{tender.required_quantity} {tender.unit}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Max Timeline</span>
              <span className="font-bold text-slate-900">{tender.delivery_timeline_days} days</span>
            </div>
          </div>
        </div>

        {success ? (
          <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-base font-bold text-emerald-900">{success}</h2>
            <p className="text-xs text-emerald-700 mt-1">Redirecting to your business dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-start gap-3">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Financial & Delivery Details */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">1. Financial Bid & Delivery</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Bid Amount (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="bid_amount"
                    type="number"
                    required
                    value={form.bid_amount}
                    onChange={handleChange}
                    placeholder="e.g. 2450000"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                  />
                  {form.bid_amount && Number(form.bid_amount) > 0 && (
                    <span className="text-[10px] text-indigo-700 mt-1 block font-mono">
                      ₹{Number(form.bid_amount).toLocaleString()} ({Number(form.bid_amount) <= tender.budget ? 'Within Budget ✓' : 'Exceeds Budget ⚠'})
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Delivery Timeline (Days) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="delivery_timeline_days"
                    type="number"
                    required
                    value={form.delivery_timeline_days}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Quantity Offered <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="quantity_offered"
                    type="number"
                    required
                    value={form.quantity_offered}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Technical Specifications & Capacity */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">2. Specifications & Vendor Credentials</h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Specifications Offered</label>
                <textarea
                  name="specifications_offered"
                  value={form.specifications_offered}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Detail your exact technical specs, brand/make, and standards provided."
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Manufacturing / Fulfillment Capacity</label>
                <input
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="e.g. Monthly capacity: 5,000 units"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Relevant CSR Execution Experience</label>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 8+ years executing CSR contracts for Tata, Reliance, and L&T"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Proposal Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Provide a comprehensive proposal summary."
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
                />
              </div>
            </div>

            {/* AI Info */}
            <div className="p-4 rounded-xl border border-violet-200 bg-violet-50 text-xs text-violet-900 space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-4 w-4 text-violet-600" />
                <span className="font-bold">Automated AI Evaluation</span>
              </div>
              <p>Upon submission, Featherless AI will immediately score your quotation across Price (15%), Specs (25%), Timeline (15%), Capacity (20%), Experience (15%), Feasibility (10%), and Verification (100%).</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
              Submit Quotation to Corporate
            </button>
          </form>
        )}
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
