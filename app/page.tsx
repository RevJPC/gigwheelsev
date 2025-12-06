"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/app/lib/auth";
import { FiZap, FiMapPin, FiDollarSign, FiWind, FiClock, FiShield, FiSmartphone, FiCheckCircle } from "react-icons/fi";
import FAQ from "@/components/FAQ";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we are returning from an OAuth redirect
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hasOAuthParams = params.has('code') || params.has('state');

      if (hasOAuthParams) {
        // Redirect to login page to let Authenticator handle the OAuth flow
        console.log("OAuth redirect detected, forwarding to /login");
        router.push(`/login?${params.toString()}`);
        return;
      }
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

  const faqItems = [
    {
      question: "How does renting a Tesla work?",
      answer: "Simply browse our fleet, select your preferred Tesla model and rental dates, and complete the booking. We'll send you pickup instructions with keyless entry details. No lines, no waiting at a counter - just unlock with your phone and drive!"
    },
    {
      question: "Which Tesla models are available?",
      answer: "We offer the complete Tesla lineup including Model 3, Model Y, Model S, and Model X. Each vehicle is maintained to the highest standards and equipped with the latest features including Autopilot."
    },
    {
      question: "How does charging work?",
      answer: "All our Teslas come with access to Tesla's Supercharger network. The vehicle will show you nearby charging stations and guide you through the process. Charging costs are included in your rental - just plug in and go!"
    },
    {
      question: "What's included in the rental?",
      answer: "Your rental includes unlimited charging at Tesla Superchargers, comprehensive insurance coverage, 24/7 roadside assistance, and full access to Tesla's Autopilot features. No hidden fees!"
    },
    {
      question: "What if I need to cancel?",
      answer: "We offer flexible cancellation. Cancel up to 24 hours before your rental starts for a full refund. Cancellations within 24 hours are subject to our standard cancellation fee."
    },
    {
      question: "Is there a mileage limit?",
      answer: "Most rentals include 300 miles per day. Additional miles are available at competitive rates. For longer trips or subscriptions, we offer unlimited mileage plans."
    }
  ];

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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center p-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              GigWheels EV
            </h1>
            <p className="text-xl md:text-2xl text-slate-300">
              The Fastest Way to Rent a Tesla
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Skip the counter. Unlock your car from your phone. Drive electric.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="/customer/vehicles" className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105">
              Browse Fleet
            </a>
            <a href="/login" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105">
              Login
            </a>
            <a href="/signup" className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105">
              Sign Up
            </a>
          </div>
        </div>
      </section>

      {/* Old Way vs New Way */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="bg-red-900/20 border border-red-800/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-red-400 mb-4">The Old Way...</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Long lines at rental counters</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Hidden fees and surprise charges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Paperwork and delays</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Gas stations and emissions</span>
                </li>
              </ul>
            </div>

            {/* New Way */}
            <div className="bg-green-900/20 border border-green-800/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-400 mb-4">The New Way</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <span>Tap your phone, unlock, and go</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <span>Transparent pricing, no surprises</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <span>Instant booking, zero paperwork</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <span>Zero emissions, free charging</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            The Ultimate Tesla Rental Experience
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <FiSmartphone className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Keyless Pickup</h3>
              <p className="text-slate-400">Unlock with your phone. No keys, no counters, no hassle.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center">
                <FiMapPin className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Real-Time Tracking</h3>
              <p className="text-slate-400">Monitor your vehicle's location, battery, and charging status.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                <FiDollarSign className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Transparent Pricing</h3>
              <p className="text-slate-400">No hidden fees. What you see is what you pay.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <FiWind className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Zero Emissions</h3>
              <p className="text-slate-400">Drive clean. All our vehicles are 100% electric.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
                <FiZap className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Ludicrous Performance</h3>
              <p className="text-slate-400">Experience instant acceleration and cutting-edge technology.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                <FiShield className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Fully Insured</h3>
              <p className="text-slate-400">Comprehensive coverage included. Drive with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Browse & Book</h3>
                <p className="text-slate-400">Select your Tesla model, choose your dates, and complete your booking in minutes.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Get Pickup Instructions</h3>
                <p className="text-slate-400">Receive keyless entry details and vehicle location directly in the app.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Unlock & Drive</h3>
                <p className="text-slate-400">Tap your phone to unlock, adjust your settings, and hit the road!</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Return Hassle-Free</h3>
                <p className="text-slate-400">Park at the designated spot, lock the car, and you're done. No paperwork required.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Drive Electric?
          </h2>
          <p className="text-xl text-slate-300">
            Join thousands of drivers who've made the switch to GigWheels EV.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/customer/vehicles" className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg rounded-lg font-semibold transition-all transform hover:scale-105">
              Browse Available Teslas
            </a>
            <a href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-lg font-semibold transition-all transform hover:scale-105">
              Create Account
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-8 px-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center text-slate-400 flex flex-col items-center gap-2">
          <p>Questions? Reach out at <a href="mailto:info@gigwheelsev.com" className="text-green-400 hover:text-green-300 transition-colors">info@gigwheelsev.com</a></p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="/privacy-policy" className="hover:text-slate-400 underline transition-colors">Privacy Policy</a>
            <a href="/data-deletion" className="hover:text-slate-400 underline transition-colors">Data Deletion</a>
          </div>
        </div>
      </section>
    </main>
  )
}
