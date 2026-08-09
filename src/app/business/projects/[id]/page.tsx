'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProjectLifecycleTimeline } from '@/components/shared/ProjectLifecycleTimeline';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import { CSRProject } from '@/types';
import { ArrowLeft, PackageCheck, Play } from 'lucide-react';

export default function BusinessProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<CSRProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`);
      const json = await res.json();
      if (json.success) setProject(json.data.project);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStartWork = async () => {
    setStarting(true);
    try {
      const res = await fetch(`/api/projects/${id}/start`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        loadData();
      }
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar currentRole="BUSINESS" />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">Loading project details...</div>
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

  const canStartWork = ['ADVANCE_PAID', 'CONTRACTED'].includes(project.status);
  const isInProgress = project.status === 'IN_PROGRESS';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="BUSINESS" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Business Dashboard</span>
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                {project.project_code}
              </span>
              <StatusBadge status={project.status} size="lg" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">{project.title}</h1>
            <p className="text-xs text-slate-600 mt-1">{project.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {canStartWork && (
              <button
                onClick={handleStartWork}
                disabled={starting}
                className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Project Execution</span>
              </button>
            )}

            {isInProgress && (
              <Link
                href={`/business/projects/${project.id}/delivery`}
                className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <PackageCheck className="h-4 w-4" />
                <span>Submit Work Delivery & Proof</span>
              </Link>
            )}
          </div>
        </div>

        <ProjectLifecycleTimeline currentStatus={project.status} />
      </main>

      <AIAssistantDrawer currentRole="BUSINESS" />
    </div>
  );
}
