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
  IndianRupee,
  Lock,
  Eye,
  Star,
  Users,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  { step: '01', role: 'NGO', title: 'Requirement Creation', desc: 'Describe community need in natural language' },
  { step: '02', role: 'AI', title: 'AI Requirement Structuring', desc: 'Featherless AI generates formal CSR specification' },
  { step: '03', role: 'NGO', title: 'NGO Approval', desc: 'Review & approve AI report before publication' },
  { step: '04', role: 'COMPANY', title: 'Project Lock', desc: 'Company reviews AI report & locks CSR sponsorship' },
  { step: '05', role: 'COMPANY', title: 'Open Tender', desc: 'Publish blind tender with required business domain' },
  { step: '06', role: 'BUSINESS', title: 'Blind Bids', desc: 'Qualified businesses submit competitive quotations' },
  { step: '07', role: 'AI', title: 'AI Tender Comparison', desc: '7-factor weighted scoring table with recommendations' },
  { step: '08', role: 'COMPANY', title: 'Company Selection', desc: 'Company selects winning vendor & executes contract' },
  { step: '09', role: 'PLATFORM', title: '20% Advance Payment', desc: 'Disbursed upon contract execution for material procurement' },
  { step: '10', role: 'BUSINESS', title: 'Execution & Delivery', desc: 'Deliver goods/services and upload documentation' },
  { step: '11', role: 'COMPANY', title: '40% Milestone Payment', desc: 'Released upon verified delivery evidence submission' },
  { step: '12', role: 'NGO', title: 'Physical Receiving Check', desc: 'NGO inspects delivery on the ground & confirms receipt' },
  { step: '13', role: 'COMPANY', title: 'Final 40% Payment', desc: 'Released upon NGO physical confirmation (100% paid)' },
  { step: '14', role: 'AI', title: 'AI Final Report & Reviews', desc: 'Verified impact report generated & peer reviews unlocked' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentRole="LANDING" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold mb-8">
            <Cpu className="h-3.5 w-3.5 text-teal-600" />
            <span>Workflow-Driven CSR Procurement & Verification Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            From CSR Need to <span className="text-teal-600">Verified Impact</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            IRISiv connects <strong>NGOs</strong>, <strong>Companies</strong>, and <strong>Businesses</strong> through a transparent CSR execution, tender, verification, and impact workflow powered by Featherless AI and deterministic 20/40/40 milestone payments.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all shadow-sm flex items-center gap-2 justify-center"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="px-7 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all flex items-center gap-2 justify-center"
            >
              <span>How It Works</span>
            </a>
          </div>

          {/* Quick Role Portal Shortcuts */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <Link
              href="/ngo/dashboard"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Building2 className="h-4 w-4 text-teal-600" />
                  <span>NGO Portal</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Submit community requirements & perform physical receipt checks.</p>
            </Link>

            <Link
              href="/corporate/dashboard"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  <span>Company Portal</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Lock projects, open tenders, and authorize 20/40/40 milestone payments.</p>
            </Link>

            <Link
              href="/business/dashboard"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                  <span>Business Portal</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Browse matching domain tenders and submit blind quotations.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Workflow Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-700 font-bold">End-to-End Governance</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">The Complete IRISiv CSR Lifecycle</h2>
            <p className="text-sm text-slate-600 mt-2">From raw community need to 100% verified impact across 14 deterministic milestones</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {WORKFLOW_STEPS.map((s, idx) => (
              <div key={s.step} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Step {s.step}
                    </span>
                    <span className="text-[9px] font-mono uppercase font-bold text-slate-400">
                      {s.role}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{s.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-300 font-bold z-10 text-xs">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Architecture 20/40/40 */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-700 font-bold">Payment Model</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">The 20 / 40 / 40 Milestone Escrow</h2>
            <p className="text-sm text-slate-600 mt-2">Zero upfront wastage. Every single rupee is disbursed upon proof and verification.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="text-4xl font-black font-mono text-teal-600">20%</div>
              <h3 className="font-bold text-slate-900 text-base">Advance Payment</h3>
              <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-[11px] font-bold text-teal-900">
                Trigger: Vendor Contract Execution
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Disbursed to the business vendor immediately upon formal contract signing so procurement and production can commence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="text-4xl font-black font-mono text-indigo-600">40%</div>
              <h3 className="font-bold text-slate-900 text-base">Fulfillment Milestone</h3>
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-900">
                Trigger: Delivery Proof Upload
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Released when the vendor uploads delivery receipts, LR notes, execution photos, and invoices for corporate review.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="text-4xl font-black font-mono text-emerald-600">40%</div>
              <h3 className="font-bold text-slate-900 text-base">Final Completion</h3>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-900">
                Trigger: NGO Ground Physical Confirmation
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Released only after the NGO physically inspects goods/services received on the ground and Featherless AI cross-validates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Value Sections */}
      <section id="for-ngos" className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700">
              <Building2 className="h-12 w-12" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase font-bold text-teal-700">For NGOs</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Get Funded Without Complex CSR Paperwork</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Simply describe what your community needs in plain language. Featherless AI structures it into a verified CSR procurement requirement, matches it with corporate sponsors, and empowers your ground team to confirm physical receipt.
              </p>
              <div className="mt-4">
                <Link href="/ngo/dashboard" className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1">
                  <span>Enter NGO Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="for-companies" className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase font-bold text-indigo-700">For Companies</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Audit-Ready CSR Procurement with Zero Leakage</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Review verified NGO needs, publish competitive blind tenders, compare quotations scored across 7 AI parameters, control 20/40/40 payment disbursements, and export certified impact reports for MCA compliance.
              </p>
              <div className="mt-4">
                <Link href="/corporate/dashboard" className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1">
                  <span>Enter Company Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="for-businesses" className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700">
              <Briefcase className="h-12 w-12" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase font-bold text-purple-700">For Businesses</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Fair, Direct Access to Enterprise CSR Contracts</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Receive notifications for tenders matching your business domain, submit transparent blind quotations, receive guaranteed 20% advance upon selection, and upload delivery proofs for fast milestone disbursements.
              </p>
              <div className="mt-4">
                <Link href="/business/dashboard" className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1">
                  <span>Enter Business Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono uppercase font-bold text-teal-700">About IRISiv</span>
          <h2 className="text-3xl font-black text-slate-900">Transforming CSR Through Deterministic Verifiability</h2>
          <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed">
            IRISiv is a next-generation corporate social responsibility procurement and governance network. We replace opaque intermediary chains with an AI-structured lifecycle, blind competitive vendor tenders, milestone escrow releases, and mandatory ground verification.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
            >
              <span>Get Started with IRISiv</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 IRISiv — Transparent CSR Procurement & Verifiable Impact Platform</p>
      </footer>

      <AIAssistantDrawer currentRole="CORPORATE" />
    </div>
  );
}
