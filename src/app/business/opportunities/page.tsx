'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject } from '@/types';
import { Search, MapPin, Tag, Users, Calendar, ArrowRight } from 'lucide-react';

export default function OpportunitiesMarketplacePage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/projects?role=BUSINESS')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          const openOnly = (json.data as CSRProject[]).filter((p) =>
            ['PUBLISHED', 'PROPOSALS_OPEN'].includes(p.status)
          );
          setProjects(openOnly);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.project_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                Marketplace
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">CSR Opportunity Bidding Marketplace</h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Browse corporate-funded CSR project requirements. Submit business proposals for automated Featherless AI scoring and milestone escrow contracting.
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code, title, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 font-medium shadow-sm"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-teal-600 cursor-pointer shadow-sm [color-scheme:light]"
          >
            <option value="ALL">All CSR Categories</option>
            <option value="EDUCATION">Education & Literacy</option>
            <option value="WATER & SANITATION">Clean Water & Sanitation</option>
            <option value="HEALTH & NUTRITION">Health & Nutrition</option>
            <option value="RENEWABLE ENERGY">Renewable Energy</option>
            <option value="DISASTER RELIEF">Disaster Relief</option>
          </select>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading marketplace opportunities...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 rounded-2xl border border-slate-200 bg-white">
            No matching CSR opportunities found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {p.project_code}
                    </span>
                    <StatusBadge status={p.status} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{p.description}</p>

                  <div className="pt-2 border-t border-slate-200 space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Approved Budget:</span>
                      <span className="font-bold text-emerald-700 text-sm font-mono">₹{p.estimated_budget.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-slate-400" /> Target:</span>
                      <span className="font-semibold text-slate-800">{p.beneficiaries.toLocaleString()} people</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-amber-600" /> Deadline:</span>
                      <span className="font-bold text-amber-700 text-xs">{p.deadline || '2026-09-30'}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> Location:</span>
                      <span className="font-semibold text-slate-800">{p.location || 'Gujarat'}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/business/opportunities/${p.id}`}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all mt-4"
                >
                  <span>Submit Proposal Bid</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
