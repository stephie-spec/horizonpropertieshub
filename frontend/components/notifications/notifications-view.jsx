"use client"

export default function NotificationsView({
  notifications,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  onMarkAsRead,
}) {
  const notificationTypes = [
    { value: "payment_received", label: "Payment Received" },
    { value: "rent_due", label: "Rent Due" },
    { value: "maintenance_request", label: "Maintenance" },
    { value: "announcement", label: "Announcement" },
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case "payment_received":
        return "✓"
      case "rent_due":
        return "⏰"
      case "maintenance_request":
        return "🔧"
      case "announcement":
        return "📢"
      default:
        return "ℹ"
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "payment_received":
        return "bg-green-50 border-green-200"
      case "rent_due":
        return "bg-orange-50 border-orange-200"
      case "maintenance_request":
        return "bg-blue-50 border-blue-200"
      case "announcement":
        return "bg-purple-50 border-purple-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getTextColor = (type) => {
    switch (type) {
      case "payment_received":
        return "text-green-700"
      case "rent_due":
        return "text-orange-700"
      case "maintenance_request":
        return "text-blue-700"
      case "announcement":
        return "text-purple-700"
      default:
        return "text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">All Types</option>
              {notificationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
            <button
              onClick={() => {
                setFilterType("")
                setFilterStatus("")
              }}
              className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              className={`${getNotificationColor(notif.type)} border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                notif.status === "unread" ? "border-2" : "opacity-75"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-2xl flex-shrink-0`}>{getNotificationIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-semibold ${getTextColor(notif.type)}`}>{notif.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                      <p className="text-gray-400 text-xs mt-2">{new Date(notif.timestamp).toLocaleString()}</p>
                    </div>
                    {notif.status === "unread" && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
