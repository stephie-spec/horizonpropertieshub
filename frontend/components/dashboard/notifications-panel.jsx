import Link from "next/link"

export default function NotificationsPanel({ data }) {
  const recentNotifications = data.notifications.slice(0, 5)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
        <Link href="/notifications" className="text-sm text-blue-600 hover:text-blue-700">
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {recentNotifications.map((notif, idx) => (
          <div key={idx} className="flex items-start p-3 bg-gray-50 rounded-lg">
            <div
              className={`text-lg mr-3 ${notif.type === "payment_received" ? "text-green-600" : notif.type === "rent_due" ? "text-orange-600" : "text-blue-600"}`}
            >
              {notif.type === "payment_received"
                ? "✓"
                : notif.type === "rent_due"
                  ? "⏰"
                  : notif.type === "maintenance_request"
                    ? "🔧"
                    : "📢"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{notif.title}</p>
              <p className="text-xs text-gray-600">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
