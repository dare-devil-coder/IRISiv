'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { UserRole } from '@/types';
import { Shield, Building2, ShieldCheck, Briefcase, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('NGO');
  const [email, setEmail] = useState('ananya@shikshafoundation.org');

  const handleRoleChange = (r: UserRole) => {
    setSelectedRole(r);
    if (r === 'NGO') setEmail('ananya@shikshafoundation.org');
    if (r === 'CORPORATE') setEmail('rajesh.verma@apextech.com');
    if (r === 'BUSINESS') setEmail('vikram@greengrowsupplies.com');
    if (r === 'ADMIN') setEmail('admin@irisiv.org');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switch (selectedRole) {
      case 'NGO':
        router.push('/ngo/dashboard');
        break;
      case 'CORPORATE':
        router.push('/corporate/dashboard');
        break;
      case 'BUSINESS':
        router.push('/business/dashboard');
        break;
      case 'ADMIN':
        router.push('/admin/dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentRole="LANDING" />

      <div className="max-w-md mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 mb-2">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Sign In to IRISiv</h1>
            <p className="text-xs text-slate-500">Access verified CSR procurement and execution portal</p>
          </div>

          {/* Role Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Your Role</label>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              {(['NGO', 'CORPORATE', 'BUSINESS', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                    selectedRole === r
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {r === 'CORPORATE' ? 'COMPANY' : r}
                </button>
              ))}
            </div>
          </div>

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
                defaultValue="password123"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>Enter {selectedRole === 'CORPORATE' ? 'COMPANY' : selectedRole} Portal</span>
              <ArrowRight className="h-4 w-4" />
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
