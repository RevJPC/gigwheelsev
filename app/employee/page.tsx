export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Employee Dashboard</h1>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
          <p className="text-slate-300">
            Employee portal coming soon. Features will include:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>Live fleet map with vehicle locations</li>
            <li>Real-time battery and charging status</li>
            <li>Vehicle assignment tracking</li>
            <li>Delivery coordination (Takeout Central integration)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
