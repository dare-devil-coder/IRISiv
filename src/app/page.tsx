'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/shared/PublicNavbar';
import { AIAssistantDrawer } from '@/components/shared/AIAssistantDrawer';
import {
  Shield,
  ArrowRight,
  Sparkles,
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  FileText,
  Lock,
  ChevronRight,
  Layers,
  Award,
  Zap,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const workflowSteps = [
    { num: '01', title: 'NGO Requirement', role: 'NGO', desc: 'NGO defines community need, beneficiary count, and budget ceiling.' },
    { num: '02', title: 'AI Analysis', role: 'AI SYSTEM', desc: 'Autonomous Featherless AI verifies MCA Schedule VII compliance and feasibility.' },
    { num: '03', title: 'NGO Approval', role: 'NGO', desc: 'NGO reviews and approves structured AI need report before corporate visibility.' },
    { num: '04', title: 'Company Lock', role: 'COMPANY', desc: 'Corporate CSR sponsors discover vetted projects and lock them for funding.' },
    { num: '05', title: 'Tender Creation', role: 'COMPANY', desc: 'Company creates public tender broadcasted to domain-matched suppliers.' },
    { num: '06', title: 'Business Bids', role: 'BUSINESS', desc: 'Verified vendors submit sealed quotations with capacity and itemized specs.' },
    { num: '07', title: 'AI Tender Comparison', role: 'AI SYSTEM', desc: '7-factor AI matrix evaluates price, timeline, experience, and recommends vendor.' },
    { num: '08', title: 'Company Selection', role: 'COMPANY', desc: 'Company reviews AI rankings and awards the contract to the winning vendor.' },
    { num: '09', title: '20% Advance Payment', role: 'PAYMENT', desc: 'Immediate 20% advance released from escrow for vendor procurement.' },
    { num: '10', title: 'Execution & Delivery', role: 'BUSINESS', desc: 'Vendor delivers goods and uploads photo evidence, LR notes, and invoices.' },
    { num: '11', title: '40% Milestone Payment', role: 'PAYMENT', desc: 'Proof verification triggers 40% milestone release to the vendor.' },
    { num: '12', title: 'NGO Field Confirmation', role: 'NGO', desc: 'NGO conducts physical ground inspection and signs off on item quantity.' },
    { num: '13', title: 'Final 40% Payment', role: 'PAYMENT', desc: 'Final 40% disbursed, completing 100% contract fulfillment.' },
    { num: '14', title: 'AI Impact Report', role: 'COMPLETION', desc: 'Audit-ready MCA Schedule VII impact certificate generated for CSR filings.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-white via-slate-50/50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold tracking-wide shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>THE NEXT-GEN CSR TRUST & TENDER PROTOCOL</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.08]">
            From CSR Need to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Verified Impact
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            IRISiv connects NGOs, Companies, and Businesses through a structured CSR requirement, tender, execution, verification, and milestone escrow workflow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm border border-slate-300 shadow-xs transition"
            >
              How It Works
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-slate-900 font-mono">100%</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Audit Trail Transparency</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-teal-600 font-mono">20/40/40</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Milestone Escrow Tranches</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-indigo-600 font-mono">7-Factor</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">AI Tender Comparison</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-slate-900 font-mono">MCA VII</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Schedule Certified Reports</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (14-STEP LIFECYCLE FLOWCHART) */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              END-TO-END CSR WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Exact 14-Stage Procurement & Verification Journey
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every CSR requirement moves strictly through transparent gates—preventing fraud, ensuring fair vendor bidding, and certifying physical delivery.
            </p>
          </div>

          {/* Workflow Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 hover:bg-white hover:shadow-sm transition-all space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                    {step.role}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Payment Milestone Callout */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-indigo-50 to-emerald-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-base">Escrow-Backed 20 / 40 / 40 Milestone Protection</h3>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                20% Advance on Vendor Selection • 40% Milestone on Proof Upload • Final 40% Released only after NGO Ground Confirmation.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
            >
              Sign Up Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ROLE PORTALS VALUE PROPOSITION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              THREE STAKEHOLDER PORTALS
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Purpose-Built for Seamless Collaboration
            </h2>
            <p className="text-xs text-slate-600">
              Each stakeholder accesses an isolated, secure application tailored to their role responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FOR NGOS */}
            <div id="for-ngos" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">For NGOs & Non-Profits</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transform raw grassroot community needs into audit-ready CSR proposals with AI Structuring. Maintain full control with the NGO Approval Gate.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Free AI Need Structuring & Feasibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Direct Access to Corporate CSR Funding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Physical Ground Verification Signoff</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/signup?role=NGO"
                className="w-full py-2.5 rounded-xl border border-teal-300 bg-teal-50/50 hover:bg-teal-100/70 text-teal-800 font-bold text-xs text-center transition"
              >
                Register as NGO →
              </Link>
            </div>

            {/* FOR COMPANIES */}
            <div id="for-companies" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">For Companies & Corporates</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lock high-impact projects, run transparent competitive tenders, evaluate vendors via 7-factor AI scoring, and automate MCA Schedule VII impact reports.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span>Discover 100% Vetted NGO Requirements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span>AI Recommends, You Select the Vendor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span>Automated MCA Schedule VII Certificates</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/signup?role=CORPORATE"
                className="w-full py-2.5 rounded-xl border border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-800 font-bold text-xs text-center transition"
              >
                Register as Company →
              </Link>
            </div>

            {/* FOR BUSINESSES */}
            <div id="for-businesses" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">For Businesses & Vendors</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bid on funded CSR tenders matching your domain. Receive a guaranteed 20% advance upon contract award and clear milestone releases upon delivery.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600" />
                    <span>Domain-Matched Tender Opportunities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600" />
                    <span>Guaranteed 20% Advance Escrow Payment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600" />
                    <span>Build Verified Social Impact Track Record</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/signup?role=BUSINESS"
                className="w-full py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 font-bold text-xs text-center transition"
              >
                Register as Vendor →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US & COMPLIANCE */}
      <section id="about-us" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              TRUST & LEGAL COMPLIANCE
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Engineered for Institutional Governance
            </h2>
            <p className="text-xs text-slate-600">
              IRISiv is compliant with the Indian Companies Act 2013 (Section 135) and MCA CSR Policy Rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <Shield className="h-5 w-5 text-teal-600" />
              <h4 className="font-bold text-slate-900 text-sm">Mandatory Legal KYC</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                12A/80G, CSR-1, PAN, and MCA CIN verification before any organization can interact on the platform.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-sm">MCA Schedule VII</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autonomous categorisation against approved CSR activities (Education, Healthcare, Sanitation, Green Energy).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">Escrow Milestones</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero lump-sum transfers. 20% advance, 40% proof milestone, and 40% physical delivery confirmation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <Award className="h-5 w-5 text-purple-600" />
              <h4 className="font-bold text-slate-900 text-sm">Verifiable Certificates</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Downloadable, cryptographically signed AI Impact Reports ready for corporate annual filings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="text-white font-bold font-sans text-sm">IRISiv</span>
              <p className="text-[11px] text-slate-500">Corporate Social Responsibility Procurement Protocol</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/auth/login" className="hover:text-white transition">Login</Link>
            <Link href="/auth/signup" className="hover:text-white transition">Sign Up</Link>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#about-us" className="hover:text-white transition">Compliance</a>
          </div>

          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} IRISiv Platform. All rights reserved.
          </p>
        </div>
      </footer>

      <AIAssistantDrawer currentRole="LANDING" />
    </div>
  );
}
