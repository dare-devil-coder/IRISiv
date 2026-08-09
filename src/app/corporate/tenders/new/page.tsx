'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { ArrowLeft, Plus, Loader2, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function CreateTenderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('projectId') || '';

  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [form, setForm] = useState({
    title: '',
    category: 'EDUCATION',
    fulfillment_type: 'PRODUCT',
    required_quantity: '',
    unit: 'units',
    minimum_specifications: '',
    budget: '',
    delivery_location: 'Gujarat',
    deadline: '',
    delivery_timeline_days: '30',
    closing_date: '',
    additional_requirements: '',
  });

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects?role=CORPORATE&orgId=org-corp-1')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProjects(json.data);
          if (!selectedProjectId && json.data.length > 0) {
            setSelectedProjectId(json.data[0].id);
          }
        }
      })
      .finally(() => setLoadingProjects(false));
  }, []);

  // Pre-fill form when project selected
  useEffect(() => {
    if (selectedProjectId) {
      const proj = projects.find((p) => p.id === selectedProjectId);
      if (proj) {
        setForm((f) => ({
          ...f,
          title: `Procurement Tender: ${proj.title}`,
          category: proj.category,
          fulfillment_type: proj.fulfillment_type || 'PRODUCT',
          required_quantity: String(proj.beneficiaries),
          budget: String(proj.estimated_budget),
          delivery_location: proj.location || 'Gujarat',
          deadline: proj.deadline || '',
          minimum_specifications: proj.ai_need_analysis
            ? proj.ai_need_analysis.required_items.map((i) => `${i.item}: ${i.specification}`).join('\n')
            : proj.description,
          closing_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        }));
      }
    }
  }, [selectedProjectId, projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !form.title || !form.budget || !form.required_quantity) {
      setError('Please select a project and fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: selectedProjectId,
          corporate_organization_id: 'org-corp-1',
          ...form,
          required_quantity: Number(form.required_quantity),
          budget: Number(form.budget),
          delivery_timeline_days: Number(form.delivery_timeline_days),
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to create tender');

      const tender = json.data;
      router.push(`/corporate/tenders/${tender.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tender');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-start gap-3">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Select NGO Project */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">1. Linked NGO Project</h2>
        {loadingProjects ? (
          <p className="text-xs text-slate-500 animate-pulse">Loading NGO projects...</p>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Approved NGO Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_code} — {p.title} (Budget: ₹{p.estimated_budget.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tender Specifications */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">2. Procurement Tender Specifications</h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Tender Title <span className="text-rose-500">*</span></label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Tender for Supply of 500 Digital Tablets to Tribal Schools"
            className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Required Quantity <span className="text-rose-500">*</span></label>
            <input
              name="required_quantity"
              type="number"
              value={form.required_quantity}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Unit</label>
            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="e.g. units / kits / sets"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Budget (₹) <span className="text-rose-500">*</span></label>
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. 2500000"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Minimum Technical Specifications <span className="text-rose-500">*</span></label>
          <textarea
            name="minimum_specifications"
            value={form.minimum_specifications}
            onChange={handleChange}
            rows={4}
            placeholder="Detail the mandatory technical, quality, and warranty standards required for vendor compliance."
            className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Delivery Timeline (Days)</label>
            <input
              name="delivery_timeline_days"
              type="number"
              value={form.delivery_timeline_days}
              onChange={handleChange}
              placeholder="30"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Location</label>
            <input
              name="delivery_location"
              value={form.delivery_location}
              onChange={handleChange}
              placeholder="e.g. Kutch, Gujarat"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tender Closing Date</label>
            <input
              name="closing_date"
              type="date"
              value={form.closing_date}
              onChange={handleChange}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Payment Terms Info */}
      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 space-y-1">
        <span className="font-bold block">Standard IRISiv Payment Terms Apply:</span>
        <p>• <strong>20% Advance</strong> recorded upon contract execution.</p>
        <p>• <strong>40% Fulfillment Milestone</strong> recorded upon proof submission.</p>
        <p>• <strong>40% Final Payment</strong> released upon NGO physical confirmation + AI cross-validation.</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        Publish Procurement Tender
      </button>
    </form>
  );
}

export default function CreateTenderPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar currentRole="CORPORATE" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/corporate/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Corporate Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Create CSR Procurement Tender</h1>
          <p className="text-xs text-slate-600 mt-1">
            Publish a blind procurement tender for qualified businesses to submit competitive quotations.
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 animate-pulse">Loading form...</div>}>
          <CreateTenderForm />
        </Suspense>
      </main>
    </div>
  );
}
