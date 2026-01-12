"use client"

import { useState, useEffect } from "react"
import DashboardHeader from "../../../components/dashboard/header"
import SummaryCards from "../../../components/dashboard/summary-cards"
import VacancyChart from "../../../components/dashboard/vacancy-chart"
import NotificationsPanel from "../../../components/dashboard/notifications-panel"
import { getMockData } from "../../../lib/mock-data"

export default function DashboardPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(getMockData())
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <SummaryCards data={data} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <VacancyChart data={data} />
          <NotificationsPanel data={data} />
        </div>
      </div>
    </div>
  )
}
