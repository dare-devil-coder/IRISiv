'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject } from '@/types';
import {
  ArrowLeft,
  PackageCheck,
  Upload,
  Loader2,
  CheckCircle2,
  FileText,
  Trash2,
  Info,
  ShieldCheck,
} from 'lucide-react';

export default function BusinessFulfillmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<CSRProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    fulfillment_type: 'PRODUCT',
    quantity_delivered: '',
    delivery_date: new Date().toISOString().split('T')[0],
    service_description: '',
    beneficiaries_served: '',
    quality: 'EXCELLENT',
    comments: 'Full fulfillment completed as per contract specifications. Evidence documents attached below.',
  });

  const [evidenceFiles, setEvidenceFiles] = useState<Array<{ name: string; type: string }>>([
    { name: 'Delivery_Receipt_Signed.pdf', type: 'FULFILLMENT_RECEIPT' },
    { name: 'Field_Execution_Photos.jpg', type: 'PHOTO' },
    { name: 'Vendor_Invoice_Final.pdf', type: 'INVOICE' },
  ]);

  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('FULFILLMENT_RECEIPT');

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProject(json.data);
          setForm((f) => ({
            ...f,
            fulfillment_type: json.data.fulfillment_type || 'PRODUCT',
            quantity_delivered: String(json.data.beneficiaries),
            beneficiaries_served: String(json.data.beneficiaries),
          }));
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    setEvidenceFiles([...evidenceFiles, { name: newFileName.trim(), type: newFileType }]);
    setNewFileName('');
  };

  const handleRemoveFile = (index: number) => {
    setEvidenceFiles(evidenceFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.quantity_delivered) {
      setError('Please specify quantity delivered or beneficiaries served.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${id}/delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_organization_id: 'org-biz-1',
          ...form,
          quantity_delivered: Number(form.quantity_delivered),
          beneficiaries_served: Number(form.beneficiaries_served || form.quantity_delivered),
          evidenceFiles,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to submit fulfillment proof');

      setSuccess('Fulfillment proof submitted! 40% milestone payment recorded. NGO has been notified to conduct physical confirmation.');
      setTimeout(() => router.push('/business/dashboard'), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">Project Not Found</p>
          <Link href="/business/dashboard" className="text-xs text-indigo-600 font-bold mt-2 inline-block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const milestoneAmount = Math.round((project.contract_value || project.estimated_budget) * 0.4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/business/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Business Dashboard
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-amber-800">{project.project_code}</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300">FULFILLMENT PROOF DUE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Upload Fulfillment Evidence & Delivery Proof</h1>
          <p className="text-xs text-slate-600 mt-1">
            Submitting this form triggers your <strong>40% Fulfillment Milestone Payment (₹{milestoneAmount.toLocaleString()})</strong> and notifies the NGO to perform physical ground verification.
          </p>
        </div>

        {success ? (
          <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h2 className="text-base font-bold text-emerald-900">{success}</h2>
            <p className="text-xs text-emerald-700">Redirecting to your business dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-start gap-3">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Delivery / Service Details */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">1. Delivery & Fulfillment Metrics</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Fulfillment Type</label>
                  <select
                    value={form.fulfillment_type}
                    onChange={(e) => setForm({ ...form, fulfillment_type: e.target.value })}
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="PRODUCT">PRODUCT</option>
                    <option value="SERVICE">SERVICE</option>
                    <option value="HYBRID">HYBRID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Quantity Delivered <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.quantity_delivered}
                    onChange={(e) => setForm({ ...form, quantity_delivered: e.target.value })}
                    placeholder={`e.g. ${project.beneficiaries}`}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Completion / Delivery Date</label>
                  <input
                    type="date"
                    value={form.delivery_date}
                    onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Vendor Execution Notes & Quality Summary</label>
                <textarea
                  value={form.comments}
                  onChange={(e) => setForm({ ...form, comments: e.target.value })}
                  rows={3}
                  placeholder="Detail your fulfillment process, QA checks performed, and delivery logistics."
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none bg-white"
                />
              </div>
            </div>

            {/* Document Evidence Upload Section */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-amber-600" />
                  2. Upload Fulfillment Evidence Documents
                </h2>
                <span className="text-xs font-mono font-bold text-teal-700">{evidenceFiles.length} File(s) Attached</span>
              </div>

              <p className="text-xs text-slate-600">
                Attach proof of delivery (signed delivery receipts, LR notes, high-res site execution photos, vendor tax invoices).
              </p>

              {/* Attached file list */}
              <div className="space-y-2">
                {evidenceFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-teal-600" />
                      <div>
                        <span className="font-bold text-slate-900 font-mono">{file.name}</span>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">{file.type}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add file widget */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Add Evidence Document</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g. Quality_Check_Certificate.pdf"
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value)}
                    className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="FULFILLMENT_RECEIPT">FULFILLMENT_RECEIPT</option>
                    <option value="PHOTO">PHOTO</option>
                    <option value="INVOICE">INVOICE</option>
                    <option value="LOGISTICS_LR">LOGISTICS_LR</option>
                    <option value="QUALITY_CERT">QUALITY_CERT</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddFile}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm transition shrink-0"
                  >
                    + Add File
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Milestone Notice */}
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50 text-xs text-teal-900 space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span className="font-bold">40% Milestone Disbursement Trigger</span>
              </div>
              <p>Upon submission, the system will record your <strong>40% Fulfillment Milestone Payment (₹{milestoneAmount.toLocaleString()})</strong> into the audit ledger and notify the NGO to physically confirm delivery.</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
              Submit Fulfillment Proof & Claim 40% Milestone
            </button>
          </form>
        )}
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
