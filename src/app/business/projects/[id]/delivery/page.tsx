'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { AIAnalysisLoadingModal } from '@/components/shared/AIAnalysisLoadingModal';
import { ToastContainer, ToastMessage } from '@/components/shared/Toast';
import { CSRProject } from '@/types';
import {
  ArrowLeft,
  PackageCheck,
  Upload,
  FileText,
  CheckCircle,
  Sparkles,
  Plus,
  Trash2,
  Paperclip,
} from 'lucide-react';

interface AttachedFile {
  id: string;
  name: string;
  size?: string;
  type: 'INVOICE' | 'DELIVERY_RECEIPT' | 'PHOTO' | 'QUANTITY_CONFIRMATION' | 'OTHER';
}

export default function WorkDeliverySubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<CSRProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState({
    quantity_delivered: '500',
    delivery_date: new Date().toISOString().split('T')[0],
    quality: 'EXCELLENT',
    comments: 'Delivered all educational kits to target central distribution center.',
  });

  const [files, setFiles] = useState<AttachedFile[]>([
    { id: 'f-1', name: 'Tax_Invoice_INV50000.pdf', size: '342 KB', type: 'INVOICE' },
    { id: 'f-2', name: 'Signed_Delivery_Challan.pdf', size: '1.2 MB', type: 'DELIVERY_RECEIPT' },
    { id: 'f-3', name: 'Handover_Photo_Evidence.jpg', size: '2.8 MB', type: 'PHOTO' },
  ]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  const handleQuantityChange = (rawValue: string) => {
    const cleaned = rawValue.replace(/^0+(?=\d)/, '');
    setFormData((prev) => ({ ...prev, quantity_delivered: cleaned }));
  };

  // Handle actual file upload selection from browser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const uploadedFiles = Array.from(e.target.files);
    const newAttachedFiles: AttachedFile[] = uploadedFiles.map((file, i) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let defaultType: AttachedFile['type'] = 'OTHER';
      if (file.name.toLowerCase().includes('invoice') || file.name.toLowerCase().includes('tax')) {
        defaultType = 'INVOICE';
      } else if (file.name.toLowerCase().includes('receipt') || file.name.toLowerCase().includes('challan')) {
        defaultType = 'DELIVERY_RECEIPT';
      } else if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
        defaultType = 'PHOTO';
      } else if (file.name.toLowerCase().includes('quantity') || file.name.toLowerCase().includes('confirm')) {
        defaultType = 'QUANTITY_CONFIRMATION';
      }

      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `f-${Date.now()}-${i}`,
        name: file.name,
        size: formattedSize,
        type: defaultType,
      };
    });

    setFiles((prev) => [...prev, ...newAttachedFiles]);
    addToast('success', 'Documents Attached', `${uploadedFiles.length} file(s) attached successfully!`);
    e.target.value = '';
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    addToast('warning', 'File Removed', 'Attachment removed from upload queue.');
  };

  const handleFileTypeChange = (fileId: string, newType: AttachedFile['type']) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, type: newType } : f))
    );
  };

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProject(json.data.project);
          if (json.data.project) {
            setFormData((prev) => ({
              ...prev,
              quantity_delivered: String(json.data.project.beneficiaries),
            }));
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      addToast('warning', 'Proof Attachment Required', 'Please attach at least one proof document (Invoice, Receipt, or Photo) before submitting.');
      return;
    }

    setSubmitting(true);
    setShowAIModal(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const res = await fetch(`/api/projects/${id}/delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity_delivered: Number(formData.quantity_delivered),
          business_organization_id: 'org-biz-1',
          evidenceFiles: files.map((f) => ({ name: f.name, type: f.type })),
        }),
      });

      const json = await res.json();
      setShowAIModal(false);

      if (json.success) {
        addToast('success', 'Work Delivery Submitted', 'Delivery proof & evidence logged! NGO physical inspection required next.');
        setTimeout(() => {
          router.push('/business/dashboard');
        }, 1200);
      } else {
        addToast('error', 'Submission Failed', json.error?.message || 'Delivery submission failed');
      }
    } catch {
      setShowAIModal(false);
      addToast('error', 'Network Error', 'Network error submitting delivery.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar currentRole="BUSINESS" />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">Loading delivery submission form...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar currentRole="BUSINESS" />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">Project record not found.</div>
      </div>
    );
  }

  const qtyNum = Number(formData.quantity_delivered) || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <AIAnalysisLoadingModal
        isOpen={showAIModal}
        title="Logging Delivery Proof & Evidence to Audit Ledger"
        subtitle="Uploading verification documents to Supabase storage & updating project state to DELIVERY_SUBMITTED..."
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Vendor Dashboard</span>
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                {project.project_code}
              </span>
              <span className="text-xs font-semibold text-slate-500">{project.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
              <PackageCheck className="h-6 w-6 text-emerald-600" />
              Submit Work Delivery & Proof Evidence
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Project: <span className="text-slate-900 font-bold">{project.title}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-700 font-semibold">Quantity Delivered (Units) *</label>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    {qtyNum.toLocaleString()} units
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity_delivered}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Actual Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={formData.delivery_date}
                  onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-emerald-600 [color-scheme:light]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Quality Rating & Handover Notes *</label>
              <select
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 [color-scheme:light] font-medium"
              >
                <option value="EXCELLENT">EXCELLENT — All items quality inspected, sealed & certified</option>
                <option value="GOOD">GOOD — Meets all technical specifications and quantity checks</option>
                <option value="ACCEPTABLE">ACCEPTABLE — Passed initial delivery inspection</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Delivery Comments & Batch Inspection Details</label>
              <textarea
                rows={3}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 leading-relaxed font-medium"
              />
            </div>

            {/* Interactive Proof Evidence Upload Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-teal-600" />
                    Work Proof Evidence Documents ({files.length})
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Attach Tax Invoice, Signed Delivery Receipt / Challan, and Ground Photos.
                  </p>
                </div>

                {/* Upload Button */}
                <label className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer transition-all shadow-sm flex items-center gap-1.5 w-fit shrink-0">
                  <Plus className="h-4 w-4" />
                  <span>Upload Document</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Files List */}
              {files.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white">
                  No documents attached yet. Click <strong className="text-teal-700">Upload Document</strong> above to add proof files.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 font-mono text-xs">{file.name}</p>
                          {file.size && <span className="text-[10px] text-slate-500 font-mono">{file.size}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Evidence Type Select */}
                        <select
                          value={file.type}
                          onChange={(e) => handleFileTypeChange(file.id, e.target.value as AttachedFile['type'])}
                          className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono font-bold text-slate-800 focus:outline-none cursor-pointer [color-scheme:light]"
                        >
                          <option value="INVOICE">TAX INVOICE</option>
                          <option value="DELIVERY_RECEIPT">DELIVERY RECEIPT</option>
                          <option value="PHOTO">PHOTO EVIDENCE</option>
                          <option value="QUANTITY_CONFIRMATION">QUANTITY CONFIRMATION</option>
                          <option value="OTHER">OTHER ATTACHMENT</option>
                        </select>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove attachment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                {submitting ? <Sparkles className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                <span>Submit Work Delivery</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
