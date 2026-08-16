'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { CSRProject } from '@/types';
import { ProjectStatusCard } from '@/components/shared/ProjectStatusCard';
import { ProjectStatusModal } from '@/components/shared/ProjectStatusModal';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { Layers, RotateCcw } from 'lucide-react';

export default function CorporateStatusPage() {
  const [projects, setProjects] = useState<CSRProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModalProject, setStatusModalProject] = useState<CSRProject | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?role=CORPORATE');
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
      <Navbar currentRole="CORPORATE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full flex-1">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="h-6 w-6 text-indigo-600" />
              Company CSR Project Status Explorer
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Click 'View Full Status & Actions' on any project to open the dynamic 9-stage operational control modal
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
            <ProjectStatusCard
              key={p.id}
              project={p}
              userRole="CORPORATE"
              onOpenStatusModal={(proj) => setStatusModalProject(proj)}
            />
          ))}
        </div>

        <ProjectStatusModal
          project={statusModalProject}
          isOpen={!!statusModalProject}
          onClose={() => setStatusModalProject(null)}
          onRefresh={loadProjects}
        />
      </main>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
