"use client";

import RouteGuard from "@/app/components/RouteGuard";

export default function CustomerDashboard() {
  return (
    <RouteGuard allowedRoles={['customer']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">Customer Dashboard</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Browse Vehicles Card */}
            <a href="/customer/vehicles" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20 group">
              <div className="text-green-400 text-4xl mb-4">🚗</div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Browse Vehicles</h2>
              <p className="text-slate-300">
                View our fleet of premium electric vehicles and book your next ride.
              </p>
            </a>

            {/* My Reservations Card */}
            <a href="/customer/reservations" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20 group">
              <div className="text-blue-400 text-4xl mb-4">📅</div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">My Reservations</h2>
              <p className="text-slate-300">
                View and manage your vehicle reservations.
              </p>
            </a>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}
