export default function SummaryCard({ icon, title, value, trend, color }) {
  const colorStyles = {
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
  }

  const textColorStyles = {
    blue: "text-blue-900",
    purple: "text-purple-900",
    green: "text-green-900",
    red: "text-red-900",
  }

  return (
    <div className={`${colorStyles[color]} border rounded-lg p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`${textColorStyles[color]} text-3xl font-bold mt-2`}>{value}</p>
          <p className="text-gray-500 text-xs mt-2">{trend}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}
