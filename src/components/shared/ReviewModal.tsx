'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types';
import { Star, X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  projectTitle: string;
  reviewerOrgId: string;
  reviewerRole: UserRole;
  targetOrgId: string;
  targetOrgName: string;
  targetRole: UserRole;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  projectTitle,
  reviewerOrgId,
  reviewerRole,
  targetOrgId,
  targetOrgName,
  targetRole,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide feedback comments.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          reviewerOrgId,
          reviewerRole,
          targetOrgId,
          targetRole,
          rating,
          comment,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to submit review');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Review Partner Organization</h3>
            <p className="text-xs text-slate-500">{projectTitle}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-400 font-mono text-[10px] uppercase block">Reviewing Partner:</span>
            <span className="font-bold text-slate-900 text-sm">{targetOrgName}</span>
            <span className="text-slate-500 block text-[10px] mt-0.5">Role: {targetRole}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Overall Rating (1 to 5 Stars)</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-mono font-bold text-xs text-slate-700">{rating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Experience & Feedback</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe partner communication, timeliness, delivery quality, transparency, or compliance compliance..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
