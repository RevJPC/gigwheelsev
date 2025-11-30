export default function Home() {
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
        <div className="text-slate-400">
          <p>Questions? Reach out at <a href="mailto:info@gigwheelsev.com" className="text-green-400 hover:text-green-300 transition-colors">info@gigwheelsev.com</a></p>
        </div>
      </div>
    </main>
  )
}
