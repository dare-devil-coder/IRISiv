'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PaymentMilestoneTracker } from '@/components/shared/PaymentMilestoneTracker';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  Briefcase,
  PackageCheck,
  Upload,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Loader2,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export default function BusinessFulfillmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<CSRProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantityDelivered, setQuantityDelivered] = useState('500');
  const [deliveryDetails, setDeliveryDetails] = useState('100% of units packaged, inspected, and delivered to the central NGO warehouse.');
  const [qualityGrade, setQualityGrade] = useState('EXCELLENT');
  const [invoiceAttached, setInvoiceAttached] = useState(true);
  const [receiptAttached, setReceiptAttached] = useState(true);
  const [photosAttached, setPhotosAttached] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const proj = json.data.project || json.data;
          setProject(proj);
          setQuantityDelivered(String(proj.target_quantity || 500));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}/delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_organization_id: 'org-biz-1',
          fulfillment_type: 'PRODUCT',
          quantity_delivered: Number(quantityDelivered),
          delivery_date: deliveryDate,
          quality: qualityGrade,
          comments: deliveryDetails,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to submit delivery');

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

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentRole="BUSINESS" />
        <div className="max-w-xl mx-auto py-16 text-center">
          <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
          <Link href="/business/dashboard" className="text-xs text-purple-700 font-bold hover:underline mt-2 inline-block">
            ← Return to Business Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const contractVal = project.contract_value || project.estimated_budget;
  const isAlreadySubmitted = ['FULFILLMENT_SUBMITTED', 'MILESTONE_40_PAID', 'NGO_CONFIRMATION_PENDING', 'NGO_CONFIRMED', 'FINAL_40_PAID', 'COMPLETED'].includes(project.status);

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
            <span className="text-xs font-mono font-bold text-purple-700">{project.project_code}</span>
            <StatusBadge status={project.status} size="sm" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <PackageCheck className="h-6 w-6 text-teal-600" />
            Contract Execution & Delivery Submission
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload commercial invoice, signed delivery receipts (LR challan), and geo-tagged proof to trigger 40% milestone release
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 20/40/40 Payment Ledger */}
        <PaymentMilestoneTracker
          payments={project.payments || []}
          contractValue={contractVal}
        />

        {isAlreadySubmitted ? (
          <div className="p-8 rounded-2xl border border-emerald-200 bg-white shadow-sm text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h2 className="text-base font-bold text-slate-900">Delivery Evidence Submitted Successfully</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your fulfillment documents have been submitted to Apex Global Technologies and Shiksha Foundation. The 40% milestone disbursement and physical receipt inspection are underway.
            </p>
            <div className="pt-2">
              <Link
                href="/business/dashboard"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm inline-flex items-center gap-2"
              >
                <span>Back to Business Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Date</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity Delivered (Units)</label>
                <input
                  type="number"
                  required
                  value={quantityDelivered}
                  onChange={(e) => setQuantityDelivered(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery & Packaging Remarks</label>
              <textarea
                rows={3}
                value={deliveryDetails}
                onChange={(e) => setDeliveryDetails(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 resize-none leading-relaxed"
              />
            </div>

            {/* Document Checkpoints */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Required Document Evidence Checklist</label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div
                  onClick={() => setInvoiceAttached(!invoiceAttached)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                    invoiceAttached ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span>1. Tax Invoice</span>
                  <CheckCircle2 className={`h-4 w-4 ${invoiceAttached ? 'text-emerald-600' : 'text-slate-300'}`} />
                </div>

                <div
                  onClick={() => setReceiptAttached(!receiptAttached)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                    receiptAttached ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span>2. Delivery Receipt (LR)</span>
                  <CheckCircle2 className={`h-4 w-4 ${receiptAttached ? 'text-emerald-600' : 'text-slate-300'}`} />
                </div>

                <div
                  onClick={() => setPhotosAttached(!photosAttached)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                    photosAttached ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span>3. Geo-tagged Photos</span>
                  <CheckCircle2 className={`h-4 w-4 ${photosAttached ? 'text-emerald-600' : 'text-slate-300'}`} />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
                <span>Submit Delivery Proof & Request 40% Milestone</span>
              </button>
            </div>
          </form>
        )}
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
