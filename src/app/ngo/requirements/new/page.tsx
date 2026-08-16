'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  FileText,
  Upload,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Sparkles,
  Layers,
  MapPin,
  Users,
} from 'lucide-react';

export default function NewRequirementPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Education');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [targetType, setTargetType] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT');
  const [targetQuantity, setTargetQuantity] = useState('');
  const [targetUnit, setTargetUnit] = useState('kits');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [deadline, setDeadline] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [docsAttached, setDocsAttached] = useState(false);

  const handleSubmit = async (isDraft: boolean) => {
    if (!title || !description || !estimatedBudget || !targetQuantity) {
      setError('Please fill in all mandatory requirement fields.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngo_organization_id: 'org-ngo-1',
          title,
          category,
          location: location || 'Ahmedabad, Gujarat',
          problem_statement: description,
          target_type: targetType,
          target_quantity: Number(targetQuantity),
          target_unit: targetUnit,
          estimated_budget: Number(estimatedBudget),
          beneficiaries_impacted: Number(beneficiaries) || Number(targetQuantity),
          proposed_timeline_days: 30,
          additional_notes: additionalNotes,
          status: isDraft ? 'DRAFT' : 'AI_ANALYZING',
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to submit requirement');

      // If submitted for analysis, trigger AI Need analysis
      if (!isDraft) {
        await fetch(`/api/projects/${json.data.id}/need-analysis`, { method: 'POST' }).catch(() => null);
      }

      router.push(`/ngo/projects/${json.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="NGO" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              CSR REQUIREMENT INITIATION
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal-600" />
            Create CSR Requirement
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Describe your community need. Featherless AI will automatically generate a structured CSR specification with budget and feasibility assessments.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Educational STEM Kits for 500 Government School Students"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">CSR Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="Education">Education & Skill Development</option>
                <option value="Healthcare">Healthcare & Medical Equipment</option>
                <option value="Water & Sanitation">Clean Drinking Water & Sanitation</option>
                <option value="Environment & Solar">Renewable Energy & Solar Installations</option>
                <option value="Nutrition">Nutrition & Ration Distribution</option>
                <option value="Disaster Relief">Disaster Relief & Rehabilitation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Implementation Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Rural Primary Schools, Ahmedabad District, Gujarat"
                  className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Community Requirement & Problem Statement (Natural Language)
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the ground need in detail: who are the beneficiaries, what items or services are needed, what is the gap being addressed, and the expected direct social outcome..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none leading-relaxed"
            />
          </div>

          {/* Scope, Quantity & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Deliverable Type</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="PRODUCT">Physical Product / Goods</option>
                <option value="SERVICE">Service / Training / Execution</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Required Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                  placeholder="500"
                  className="w-2/3 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
                <input
                  type="text"
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  placeholder="kits / units"
                  className="w-1/3 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Estimated Budget (₹ INR)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  required
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  placeholder="180000"
                  className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Beneficiaries & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Beneficiaries Count</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  value={beneficiaries}
                  onChange={(e) => setBeneficiaries(e.target.value)}
                  placeholder="e.g. 500 students"
                  className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Desired Completion Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Supporting Documents Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Supporting Documents / Field Survey</label>
            <div
              onClick={() => setDocsAttached(!docsAttached)}
              className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition ${
                docsAttached
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950'
                  : 'border-slate-300 hover:border-teal-500 bg-slate-50'
              }`}
            >
              {docsAttached ? (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Field_Survey_Assessment.pdf attached (Click to remove)</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                  <Upload className="h-4 w-4 text-slate-400" />
                  <span>Attach Field Assessment / Beneficiary List (PDF, DOCX)</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Submit & Run AI Need Analysis</span>
            </button>
          </div>
        </div>
      </main>

      <AIAssistantDrawer currentRole="NGO" />
    </div>
  );
}
