'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  ShieldCheck,
  Building2,
  Briefcase,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Award,
  Zap,
  FileText,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  { step: '01', actor: 'NGO', label: 'Submit Need', desc: 'Describe community need in plain text', color: 'bg-teal-600' },
  { step: '02', actor: 'AI', label: 'AI Structures', desc: 'Featherless AI converts to CSR spec', color: 'bg-violet-600' },
  { step: '03', actor: 'NGO', label: 'NGO Approves', desc: 'Review & approve AI output', color: 'bg-teal-600' },
  { step: '04', actor: 'Corporate', label: 'Corporate Interest', desc: 'Express interest & publish tender', color: 'bg-emerald-600' },
  { step: '05', actor: 'Business', label: 'Blind Quotations', desc: 'Businesses submit bids', color: 'bg-indigo-600' },
  { step: '06', actor: 'AI', label: 'AI Evaluates', desc: '7-factor scoring table', color: 'bg-violet-600' },
  { step: '07', actor: 'Corporate', label: 'Selection', desc: 'Select quotation & contract', color: 'bg-emerald-600' },
  { step: '08', actor: 'Platform', label: '20% Advance', desc: 'Recorded on contract execution', color: 'bg-slate-600' },
  { step: '09', actor: 'Business', label: 'Fulfillment', desc: 'Deliver & upload evidence', color: 'bg-indigo-600' },
  { step: '10', actor: 'Platform', label: '40% Milestone', desc: 'Triggered on proof upload', color: 'bg-slate-600' },
  { step: '11', actor: 'NGO', label: 'Physical Check', desc: 'NGO inspects & confirms', color: 'bg-teal-600' },
  { step: '12', actor: 'AI', label: 'AI Cross-Validates', desc: 'Featherless AI cross-check', color: 'bg-violet-600' },
  { step: '13', actor: 'Platform', label: '40% Final + Impact', desc: 'Final payment & impact report', color: 'bg-slate-600' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="LANDING" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-semibold mb-8">
            <Cpu className="h-3.5 w-3.5 text-teal-600" />
            <span>Featherless AI-Powered CSR Procurement & Trust Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            CSR Procurement That <span className="text-teal-600">Actually Delivers</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From NGO need to verified impact — one transparent platform connecting NGOs, Corporates, and Businesses with AI-structured tenders, blind quotations, and a milestone-driven 20/40/40 payment model.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ngo/dashboard" className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all shadow-sm flex items-center gap-2 justify-center">
              <Building2 className="h-4 w-4" />
              NGO Portal
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/corporate/dashboard" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-sm flex items-center gap-2 justify-center">
              <ShieldCheck className="h-4 w-4" />
              Corporate Portal
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/business/dashboard" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-sm flex items-center gap-2 justify-center">
              <Briefcase className="h-4 w-4" />
              Business Portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Model Highlight */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-700 font-bold">Payment Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">The 20 / 40 / 40 Model</h2>
            <p className="text-sm text-slate-600 mt-2">Three milestone payments tied to verifiable real-world events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { pct: '20%', label: 'Advance Payment', trigger: 'Contract Execution', desc: 'Recorded when vendor contract is formally signed and executed.', color: 'teal', icon: FileText },
              { pct: '40%', label: 'Fulfillment Milestone', trigger: 'Delivery Proof Upload', desc: 'Recorded when business submits delivery/service evidence.', color: 'indigo', icon: CheckCircle2 },
              { pct: '40%', label: 'Final Payment', trigger: 'NGO Physical Confirmation', desc: 'Released only after NGO physically verifies receipt + AI cross-validates.', color: 'emerald', icon: Award },
            ].map((item) => (
              <div key={item.label} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="text-4xl font-black font-mono text-slate-900 mb-3">{item.pct}</div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{item.label}</h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold mb-3 border border-slate-200">
                  <span>Trigger: {item.trigger}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13-Step Workflow */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-700 font-bold">End-to-End Lifecycle</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">13 Steps. Zero Ambiguity.</h2>
            <p className="text-sm text-slate-600 mt-2">Every CSR project follows the exact same transparent state machine</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.step} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm relative">
                <div className={`inline-flex items-center justify-center h-7 w-7 rounded-lg ${step.color} text-white text-xs font-black mb-3`}>
                  {step.step}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mb-1 font-bold">{step.actor}</div>
                <h4 className="text-xs font-bold text-slate-900">{step.label}</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-700 font-bold">AI Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Powered by Featherless AI</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Cpu, title: 'AI Need Structuring', desc: 'Converts unstructured NGO descriptions into structured CSR procurement requirements with item specs, budgets, and urgency scoring.' },
              { icon: Zap, title: '7-Factor Quotation Scoring', desc: 'Evaluates business quotations on Price, Specs, Timeline, Capacity, Experience, Feasibility, and Verification for side-by-side corporate review.' },
              { icon: ShieldCheck, title: 'Dual Cross-Verification', desc: 'Cross-validates NGO physical inspection against vendor delivery proof to detect mismatches and prevent fraud.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 w-fit mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Access Cards */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Choose Your Portal</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Link href="/ngo/dashboard" className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-md transition-all group">
              <div className="p-3 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 w-fit mb-4">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">NGO Portal</h3>
                <ArrowRight className="h-4 w-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">Submit community needs, review AI analysis, confirm physical fulfillment, and download verified impact reports.</p>
            </Link>

            <Link href="/corporate/dashboard" className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all group">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Corporate Portal</h3>
                <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">Create tenders, compare AI-scored quotations, authorize 20/40/40 milestone payments, and track impact.</p>
            </Link>

            <Link href="/business/dashboard" className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all group">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 w-fit mb-4">
                <Briefcase className="h-6 w-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Business Portal</h3>
                <ArrowRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">Browse tenders, submit blind quotations, track active project execution, and upload fulfillment evidence.</p>
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>IRISiv — Verified CSR Procurement & Impact Platform | Powered by Featherless AI</p>
      </footer>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
