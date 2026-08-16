'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicNavbar } from '@/components/shared/PublicNavbar';
import { UserRole } from '@/types';
import {
  Building2,
  ShieldCheck,
  Briefcase,
  Upload,
  CheckCircle2,
  ArrowRight,
  Shield,
  FileText,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<UserRole>('NGO');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [domain, setDomain] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [docUploaded, setDocUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleNextToKYC = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleCompleteKYC = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgName || 'Authorized Signatory',
          email: email || `contact@${orgName ? orgName.toLowerCase().replace(/\s+/g, '') : 'org'}.org`,
          password: 'Password123!',
          role,
          organizationName: orgName,
          location,
          domain,
          registrationNumber: regNumber,
          panNumber: taxId,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Registration failed');

      router.push('/auth/status?submitted=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNavbar />

      <div className="max-w-2xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white text-center">
            <div className="inline-flex p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 mb-3">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Create IRISiv Account & KYC Verification</h1>
            <p className="text-xs text-slate-500 mt-1">Multi-step KYC verified CSR compliance registration</p>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[
                { num: 1, label: 'Select Role' },
                { num: 2, label: 'Organization Info' },
                { num: 3, label: 'Upload KYC Documents' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= s.num ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs font-semibold ${step >= s.num ? 'text-slate-800' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                  {s.num < 3 && <div className="h-[1px] w-6 bg-slate-200" />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* STEP 1: SELECT ROLE */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-800 text-center">Select Your Organization Type</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('NGO')}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      role === 'NGO'
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Building2 className={`h-6 w-6 mb-3 ${role === 'NGO' ? 'text-teal-600' : 'text-slate-400'}`} />
                    <h4 className="font-bold text-slate-900 text-sm">NGO</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Non-Profit Foundation or Trust seeking CSR funding</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('CORPORATE')}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      role === 'CORPORATE'
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <ShieldCheck className={`h-6 w-6 mb-3 ${role === 'CORPORATE' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <h4 className="font-bold text-slate-900 text-sm">Company</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Corporate entity managing CSR budget & tenders</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('BUSINESS')}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      role === 'BUSINESS'
                        ? 'border-purple-500 bg-purple-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Briefcase className={`h-6 w-6 mb-3 ${role === 'BUSINESS' ? 'text-purple-600' : 'text-slate-400'}`} />
                    <h4 className="font-bold text-slate-900 text-sm">Business</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Vendor/Supplier bidding on procurement tenders</p>
                  </button>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
                  >
                    <span>Continue to Organization Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ORG DETAILS */}
            {step === 2 && (
              <form onSubmit={handleNextToKYC} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={role === 'NGO' ? 'e.g. Navjeevan Rural Welfare Society' : role === 'CORPORATE' ? 'e.g. Acme Tech Solutions Ltd' : 'e.g. SolarGreen Enterprises'}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@org.org"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91-98765-43210"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location / Head Office</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Ahmedabad, Gujarat"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Domain / Category</label>
                    <input
                      type="text"
                      required
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder={role === 'NGO' ? 'e.g. Healthcare & Education' : role === 'CORPORATE' ? 'e.g. IT & Telecommunications' : 'e.g. Solar & Renewable Supplies'}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {role === 'NGO' ? 'NGO Registration / 12A Number' : role === 'CORPORATE' ? 'Company CIN Number' : 'GSTIN / Udyam Number'}
                    </label>
                    <input
                      type="text"
                      required
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="e.g. GJ/2022/00918"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PAN / Tax ID</label>
                    <input
                      type="text"
                      required
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="e.g. AAATS1234C"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
                  >
                    <span>Proceed to KYC Document Upload</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: KYC UPLOAD & SUBMIT */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 space-y-1">
                  <span className="font-bold block">Role-Specific KYC Requirements for {role}:</span>
                  <ul className="list-disc list-inside text-teal-800 text-[11px] space-y-0.5">
                    {role === 'NGO' && (
                      <>
                        <li>12A & 80G Registration Certificate</li>
                        <li>PAN Card of the NGO</li>
                        <li>Authorized Signatory Board Resolution</li>
                      </>
                    )}
                    {role === 'CORPORATE' && (
                      <>
                        <li>Certificate of Incorporation (CIN)</li>
                        <li>Corporate CSR Committee Authorization</li>
                        <li>Company PAN Card</li>
                      </>
                    )}
                    {role === 'BUSINESS' && (
                      <>
                        <li>GST Registration Certificate (GSTIN)</li>
                        <li>MSME / Udyam Certificate (if applicable)</li>
                        <li>Vendor Bank Account Proof & PAN</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Upload Widget */}
                <div
                  onClick={() => setDocUploaded(true)}
                  className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                    docUploaded
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                      : 'border-slate-300 hover:border-teal-500 bg-slate-50/50'
                  }`}
                >
                  {docUploaded ? (
                    <div className="space-y-2">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                      <p className="font-bold text-xs text-emerald-950">Documents Attached Successfully</p>
                      <p className="text-[10px] text-emerald-700">3 files ready for compliance screening: KYC_Bundle_{role}.pdf</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                      <p className="font-bold text-xs text-slate-800">Click to upload KYC Documentation Bundle</p>
                      <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 25MB (Simulated upload)</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteKYC}
                    disabled={submitting || !docUploaded}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center gap-2"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    <span>Submit KYC Application</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
