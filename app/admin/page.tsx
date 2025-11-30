export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Admin Dashboard</h1>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
          <p className="text-slate-300">
            Admin portal coming soon. Full system control including:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>User management (add/remove/edit permissions)</li>
            <li>Vehicle fleet management (add/remove vehicles, set pricing)</li>
            <li>Complete system access and configuration</li>
            <li>Analytics and reporting</li>
            <li>Tesla API integration management</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
