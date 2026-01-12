"use client"

import { useState, useEffect } from "react"
import { getMockData } from "../../../lib/mock-data"
import PageHeader from "../../../components/page-header"
import NotificationsView from "../../../components/notifications/notifications-view"

export default function NotificationsPage() {
  const [data, setData] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  useEffect(() => {
    const mockData = getMockData()
    setData(mockData)
    setNotifications(mockData.notifications)
  }, [])

  if (!data) return <div>Loading...</div>

  const filteredNotifications = notifications.filter((notif) => {
    if (filterType && notif.type !== filterType) return false
    if (filterStatus && notif.status !== filterStatus) return false
    return true
  })

  const handleMarkAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: "read" } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })))
  }

  const unreadCount = notifications.filter((n) => n.status === "unread").length

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        icon="🔔"
        action={
          unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
            >
              Mark All as Read
            </button>
          )
        }
      />
      <div className="p-6">
        <NotificationsView
          notifications={filteredNotifications}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
    </div>
  )
}
