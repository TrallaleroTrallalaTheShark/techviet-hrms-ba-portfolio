export default function StatCard({ label, value, sub, icon, color = "text-brand" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        {icon && <span className={`text-xl ${color}`}>{icon}</span>}
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-green-600 mt-1">{sub}</div>}
    </div>
  )
}