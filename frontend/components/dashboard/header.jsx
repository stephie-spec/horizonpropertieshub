"use client"

import { useAuth } from "../../app/context/AuthContext"
import { formatDate } from "../../lib/utils"

export default function DashboardHeader() {
  const { user } = useAuth()

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">{formatDate(new Date())}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600 text-sm">Today's Overview</p>
        </div>
      </div>
    </div>
  )
}
