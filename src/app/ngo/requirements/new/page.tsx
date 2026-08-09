'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Plus, Loader2, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['EDUCATION', 'HEALTHCARE', 'WATER & SANITATION', 'RENEWABLE ENERGY', 'DISASTER RELIEF', 'SKILL DEVELOPMENT', 'FOOD & NUTRITION'];
const URGENCIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const FULFILLMENT_TYPES = ['PRODUCT', 'SERVICE', 'HYBRID'];

export default function CreateRequirementPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    category: 'EDUCATION',
    fulfillment_type: 'PRODUCT',
    location: 'Gujarat',
    description: '',
    beneficiaries: '',
    estimated_budget: '',
    deadline: '',
    urgency: 'MEDIUM',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (submitImmediately: boolean) => {
    if (!form.title.trim() || !form.description.trim() || !form.beneficiaries || !form.estimated_budget) {
      setError('Please fill in all required fields (Title, Description, Beneficiaries, Budget).');
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload = {
      ngo_organization_id: 'org-ngo-1',
      ...form,
      beneficiaries: Number(form.beneficiaries),
      estimated_budget: Number(form.estimated_budget),
      submitImmediately,
    };

    try {
      // Try /api/requirements first
      let res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Fallback to /api/projects if 404
      if (res.status === 404) {
        res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      let json;
      try {
        json = await res.json();
      } catch {
        throw new Error(`Server response error: ${res.status} ${res.statusText}`);
      }

      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message || `Failed to create requirement (Status ${res.status})`);
      }

      const project = json.data;
      setSuccess(project.project_code);
      setTimeout(() => router.push(`/ngo/projects/${project.id}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create requirement');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar currentRole="NGO" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/ngo/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-3">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Create CSR Requirement</h1>
          <p className="text-xs text-slate-600 mt-1">
            Describe your community need. Featherless AI will structure it into a formal CSR procurement specification for corporate review.
          </p>
        </div>

        {success ? (
          <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-base font-bold text-emerald-900">Requirement Created!</h2>
            <p className="text-xs text-emerald-700 mt-1">Project code: <strong className="font-mono">{success}</strong>. Redirecting to your project detail...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-start gap-3">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Basic Info */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Project Information</h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Supply of Solar Lanterns to 500 Tribal Families"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Category <span className="text-rose-500">*</span></label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Fulfillment Type</label>
                  <select name="fulfillment_type" value={form.fulfillment_type} onChange={handleChange} className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {FULFILLMENT_TYPES.map((ft) => <option key={ft} value={ft}>{ft}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Urgency</label>
                  <select name="urgency" value={form.urgency} onChange={handleChange} className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description <span className="text-rose-500">*</span>
                  <span className="ml-1 text-slate-500 font-normal">(Plain language — AI will structure this)</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your community's need in detail. Include the current problem, who it affects, where they are, and what you specifically need. The more detail, the better AI can structure your requirement."
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none bg-white transition"
                />
              </div>
            </div>

            {/* Scale & Budget */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Scale & Budget</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Estimated Beneficiaries <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="beneficiaries"
                    type="number"
                    min="1"
                    value={form.beneficiaries}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Estimated Budget (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="estimated_budget"
                    type="number"
                    min="1"
                    value={form.estimated_budget}
                    onChange={handleChange}
                    placeholder="e.g. 2500000"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition"
                  />
                  {form.estimated_budget && Number(form.estimated_budget) > 0 && (
                    <p className="text-[10px] text-teal-700 mt-1 font-mono">₹{Number(form.estimated_budget).toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Kutch District, Gujarat"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Deadline</label>
                  <input
                    name="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* AI Info Box */}
            <div className="p-4 rounded-xl border border-violet-200 bg-violet-50">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-600 animate-pulse" />
                <span className="text-xs font-bold text-violet-900">Featherless AI Processing</span>
              </div>
              <p className="text-[11px] text-violet-800 leading-relaxed">
                After submission, Featherless AI will analyze your description and generate: structured title, problem summary, beneficiary group breakdown, required item list with quantities, CSR eligibility indicators, and estimated timeline. You will review and approve the AI output before it goes to corporate review.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Submit for AI Analysis
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
