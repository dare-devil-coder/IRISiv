'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  FileText,
  Briefcase,
  IndianRupee,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Upload,
} from 'lucide-react';

function NewTenderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get('projectId') || 'proj-1021';

  const [title, setTitle] = useState('Procurement of Clean Drinking Water RO Systems');
  const [description, setDescription] = useState('Procurement, delivery, installation, and commissioning of 10 solar-powered RO water filtration units.');
  const [targetType, setTargetType] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT');
  const [quantity, setQuantity] = useState('10');
  const [unit, setUnit] = useState('units');
  const [maxBudget, setMaxBudget] = useState('150000');
  const [closingDays, setClosingDays] = useState('7');
  const [deliveryDeadline, setDeliveryDeadline] = useState('30');
  const [businessDomain, setBusinessDomain] = useState('Water & Sanitation Supplies');
  const [specialRequirements, setSpecialRequirements] = useState('Must include 2-year replacement warranty and quarterly maintenance visits.');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectIdParam,
          corporate_organization_id: 'org-corp-1',
          title,
          description,
          target_type: targetType,
          target_quantity: Number(quantity),
          target_unit: unit,
          max_budget: Number(maxBudget),
          closing_days: Number(closingDays),
          delivery_deadline_days: Number(deliveryDeadline),
          business_domain: businessDomain,
          special_requirements: specialRequirements,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to publish tender');

      router.push('/corporate/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
            PROCUREMENT TENDER INITIATION
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-indigo-600" />
          Publish Blind CSR Procurement Tender
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Open a competitive tender for qualified vendors. Featherless AI will independently score bids across 7 criteria once the tender closes.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Domain Match Notification Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-start gap-3">
        <Bell className="h-5 w-5 text-indigo-700 mt-0.5 shrink-0" />
        <div className="text-xs text-indigo-950 space-y-0.5">
          <span className="font-bold block">Targeted Vendor Broadcasting:</span>
          <p>
            Upon publication, all verified businesses matching the selected domain (<strong>{businessDomain}</strong>) will be notified immediately to submit blind bids.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Tender Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Tender Scope & Technical Description</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Required Business Domain</label>
            <select
              value={businessDomain}
              onChange={(e) => setBusinessDomain(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-semibold"
            >
              <option value="Education Supplies">Education & School Supplies</option>
              <option value="Water & Sanitation Supplies">Water & Sanitation Supplies</option>
              <option value="Solar & Renewable Energy">Solar & Renewable Energy</option>
              <option value="Healthcare Supplies">Healthcare & Medical Supplies</option>
              <option value="General CSR Procurement">General CSR Procurement</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity & Unit</label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-2/3 text-xs p-3 rounded-xl border border-slate-200 font-mono font-bold"
              />
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-1/3 text-xs p-3 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Maximum Ceiling Budget (₹ INR)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="number"
                required
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tender Bidding Duration (Days)</label>
            <input
              type="number"
              required
              value={closingDays}
              onChange={(e) => setClosingDays(e.target.value)}
              placeholder="7"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Required Delivery Timeline (Days)</label>
            <input
              type="number"
              required
              value={deliveryDeadline}
              onChange={(e) => setDeliveryDeadline(e.target.value)}
              placeholder="30"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Special Technical & Compliance Requirements</label>
          <textarea
            rows={2}
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 resize-none leading-relaxed"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            <span>Publish Tender & Broadcast to Matching Vendors</span>
          </button>
        </div>
      </form>
    </main>
  );
}

export default function NewTenderPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />
      <Suspense fallback={<div className="p-12 text-center text-xs">Loading tender form...</div>}>
        <NewTenderForm />
      </Suspense>
      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
