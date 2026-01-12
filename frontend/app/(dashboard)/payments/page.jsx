"use client"

import { useState, useEffect } from "react"
import { getMockData } from "../../../lib/mock-data"
import PageHeader from "../../../components/page-header"
import PaymentsTable from "../../../components/payments/payments-table"

export default function PaymentsPage() {
  const [data, setData] = useState(null)
  const [filterMonth, setFilterMonth] = useState("")
  const [filterYear, setFilterYear] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  useEffect(() => {
    setData(getMockData())
  }, [])

  if (!data) return <div>Loading...</div>

  const filteredPayments = data.payments.filter((payment) => {
    if (filterMonth && payment.month !== filterMonth) return false
    if (filterYear && payment.year !== Number.parseInt(filterYear)) return false
    if (filterStatus && payment.status !== filterStatus) return false
    return true
  })

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const years = [2023, 2024, 2025]

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader title="Payments" description="Track all rent payments and M-Pesa transactions" icon="💰" />
      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">All Months</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
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
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <button
                onClick={() => {
                  setFilterMonth("")
                  setFilterYear("")
                  setFilterStatus("")
                }}
                className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Total Payments</p>
            <p className="text-2xl font-bold text-blue-900">{filteredPayments.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Paid Payments</p>
            <p className="text-2xl font-bold text-green-900">
              KES{" "}
              {filteredPayments
                .filter((p) => p.status === "paid")
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Unpaid Payments</p>
            <p className="text-2xl font-bold text-red-900">
              KES{" "}
              {filteredPayments
                .filter((p) => p.status === "unpaid")
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        <PaymentsTable payments={filteredPayments} tenants={data.tenants} />
      </div>
    </div>
  )
}
