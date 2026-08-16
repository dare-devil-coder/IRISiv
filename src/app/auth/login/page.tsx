'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicNavbar } from '@/components/shared/PublicNavbar';
import { UserRole } from '@/types';
import { Shield, Building2, ShieldCheck, Briefcase, ArrowRight, Lock, Users, ShieldAlert, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('ananya@shikshafoundation.org');
  const [password, setPassword] = useState('ngo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    { role: 'NGO', name: 'NGO Partner', email: 'ananya@shikshafoundation.org', pass: 'ngo', org: 'Shiksha Foundation' },
    { role: 'CORPORATE', name: 'Company CSR', email: 'rahul@apextech.com', pass: 'corp', org: 'Apex Technologies' },
    { role: 'BUSINESS', name: 'Vendor Supplier', email: 'vikram@greengrow.in', pass: 'biz', org: 'GreenGrow Supplies' },
    { role: 'ADMIN', name: 'Compliance Admin', email: 'admin@irisiv.org', pass: 'admin', org: 'IRISiv Compliance' },
  ];

  const selectAccount = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Invalid credentials');
      }

      const role = json.data?.role as UserRole;
      if (json.data?.token) {
        localStorage.setItem('irisiv_auth_token', json.data.token);
      }

      // Auto redirect based on account role
      switch (role) {
        case 'NGO':
          router.push('/ngo/dashboard');
          break;
        case 'CORPORATE':
          router.push('/company/dashboard');
          break;
        case 'BUSINESS':
          router.push('/business/dashboard');
          break;
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/ngo/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNavbar />

      <div className="max-w-md mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 mb-2">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Sign In to IRISiv</h1>
            <p className="text-xs text-slate-500">Access verified CSR procurement and execution portal</p>
          </div>

          {/* Quick Select Demo Accounts */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 font-mono uppercase tracking-wider">
              Quick Test Accounts (Click to Fill)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => selectAccount(acc)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    email === acc.email
                      ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{acc.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono block truncate">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Role Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            <span>Need an organization account? </span>
            <Link href="/auth/signup" className="text-teal-700 font-bold hover:underline">
              Sign Up & Submit KYC
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
