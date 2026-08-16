'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { ProjectStatusCard } from '@/components/shared/ProjectStatusCard';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { Layers, RotateCcw } from 'lucide-react';

export default function NGOStatusPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?role=NGO');
      const json = await res.json();
      if (json.success) setProjects(json.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="NGO" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="h-6 w-6 text-teal-600" />
              NGO Requirements Lifecycle Status Explorer
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Multi-dimensional state matrix tracking AI feasibility, Company locks, Vendor bids, 20/40/40 disbursements, and Ground receiving checks
            </p>
          </div>

          <button
            onClick={loadProjects}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <ProjectStatusCard key={p.id} project={p} userRole="NGO" />
          ))}
        </div>
      </main>

      <AIAssistantDrawer currentRole="NGO" />
    </div>
  );
}
