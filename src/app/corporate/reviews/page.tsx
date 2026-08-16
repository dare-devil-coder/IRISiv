'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { OrgReview } from '@/types';
import { ReviewModal } from '@/components/shared/ReviewModal';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { Star, ShieldCheck, Plus, RotateCcw } from 'lucide-react';

export default function CorporateReviewsPage() {
  const [activeTab, setActiveTab] = useState<'RECEIVED' | 'GIVEN'>('RECEIVED');
  const [reviews, setReviews] = useState<OrgReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews?orgId=org-corp-1');
      const json = await res.json();
      if (json.success) setReviews(json.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const receivedReviews = reviews.filter((r) => r.target_org_id === 'org-corp-1');
  const givenReviews = reviews.filter((r) => r.reviewer_org_id === 'org-corp-1');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Star className="h-6 w-6 text-amber-500 fill-amber-400" />
              Company CSR Partner Ratings & Reviews
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Mutual peer transparency reviews for Apex Global Technologies, NGO Partners, and Vendors
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadReviews}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>Review NGO / Vendor</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('RECEIVED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'RECEIVED'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Reviews Received ({receivedReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('GIVEN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'GIVEN'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Reviews Given ({givenReviews.length})
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeTab === 'RECEIVED' ? receivedReviews : givenReviews).map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-indigo-700 block">
                    {rev.project_title || 'CSR Project'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {activeTab === 'RECEIVED' ? `From: ${rev.reviewer_org_name}` : `To: ${rev.target_org_name}`}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Role: {activeTab === 'RECEIVED' ? rev.reviewer_role : rev.target_role}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                "{rev.comment}"
              </p>

              <div className="text-[10px] text-slate-400 font-mono text-right">
                {new Date(rev.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={loadReviews}
          projectId="proj-1025"
          projectTitle="Nutrition Kits for Underprivileged Children"
          reviewerOrgId="org-corp-1"
          reviewerRole="CORPORATE"
          targetOrgId="org-ngo-1"
          targetOrgName="Shiksha Foundation India"
          targetRole="NGO"
        />
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
