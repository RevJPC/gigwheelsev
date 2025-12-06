"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserRole } from "@/app/lib/auth";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we are returning from an OAuth redirect
    const hasOAuthParams = searchParams.has('code') || searchParams.has('state');

    if (hasOAuthParams) {
      // Redirect to login page to let Authenticator handle the OAuth flow
      console.log("OAuth redirect detected, forwarding to /login");
      router.push(`/login?${searchParams.toString()}`);
      return;
    }

    // Normal load - check if user is already authenticated
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const role = await getUserRole();
      console.log("Redirecting for role:", role);

      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'employee') {
        router.push('/employee');
      } else {
        router.push('/customer');
      }
    } catch (error) {
      console.log('Not authenticated:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-slate-300">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            GigWheels EV
          </h1>
          <p className="text-xl md:text-2xl text-slate-300">
            Premium Electric Vehicle Fleet Management
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <a href="/customer/vehicles" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
            Browse Fleet
          </a>
          <a href="/login" className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">
            Login
          </a>
          <a href="/signup" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors">
            Sign Up
          </a>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 md:p-12 space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Coming Soon
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We're building the future of electric vehicle fleet management.
            Track your Tesla fleet in real-time, manage rentals, and optimize your operations.
          </p>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
            <div className="space-y-2">
              <div className="text-green-400 text-2xl">⚡</div>
              <h3 className="text-white font-semibold">Real-Time Tracking</h3>
              <p className="text-slate-400 text-sm">
                Monitor vehicle locations, battery levels, and charging status
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-blue-400 text-2xl">🚗</div>
              <h3 className="text-white font-semibold">Fleet Management</h3>
              <p className="text-slate-400 text-sm">
                Manage your entire Tesla fleet from one dashboard
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-purple-400 text-2xl">📊</div>
              <h3 className="text-white font-semibold">Analytics</h3>
              <p className="text-slate-400 text-sm">
                Optimize pricing and utilization with detailed insights
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-slate-400 flex flex-col items-center gap-2">
          <p>Questions? Reach out at <a href="mailto:info@gigwheelsev.com" className="text-green-400 hover:text-green-300 transition-colors">info@gigwheelsev.com</a></p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="/privacy-policy" className="hover:text-slate-400 underline transition-colors">Privacy Policy</a>
            <a href="/data-deletion" className="hover:text-slate-400 underline transition-colors">Data Deletion</a>
          </div>
        </div>
      </div>
    </main>
  )
}
