"use client"

import { useState } from "react"

export default function RentStatementsView({ data, selectedTenantId, onSelectTenant }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const selectedTenant = data.tenants.find((t) => t.id === selectedTenantId)
  const unit = data.units.find((u) => u.id === selectedTenant?.unit_id)
  const tenantPayments = data.payments.filter((p) => p.tenant_id === selectedTenantId)

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

  const currentPayment = tenantPayments.find((p) => p.month === months[selectedMonth] && p.year === selectedYear)

  const amountDue = unit?.rent_amount || 0
  const amountPaid = currentPayment?.status === "paid" ? currentPayment.amount : 0
  const balance = amountDue - amountPaid

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tenant Selector */}
      <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Tenant</h3>
        <div className="space-y-2">
          {data.tenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => onSelectTenant(tenant.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedTenantId === tenant.id ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-900 hover:bg-gray-100"
              }`}
            >
              <p className="font-medium">{tenant.name}</p>
              <p className={selectedTenantId === tenant.id ? "text-blue-100 text-sm" : "text-gray-600 text-sm"}>
                Unit {data.units.find((u) => u.id === tenant.unit_id)?.unit_number}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Statement */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{selectedTenant?.name}</h3>
            <p className="text-gray-600">Unit {unit?.unit_number}</p>
          </div>

          {/* Month/Year Selector */}
          <div className="flex gap-4 mb-6">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number.parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {months.map((month, idx) => (
                <option key={month} value={idx}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {[2023, 2024, 2025].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Amount Due</p>
              <p className="text-2xl font-bold text-gray-900">KES {amountDue.toLocaleString()}</p>
            </div>
            <div className={`p-4 rounded-lg ${amountPaid > 0 ? "bg-green-50" : "bg-gray-50"}`}>
              <p className={`text-sm mb-1 ${amountPaid > 0 ? "text-green-600" : "text-gray-600"}`}>Amount Paid</p>
              <p className={`text-2xl font-bold ${amountPaid > 0 ? "text-green-700" : "text-gray-900"}`}>
                KES {amountPaid.toLocaleString()}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${balance > 0 ? "bg-red-50" : "bg-green-50"}`}>
              <p className={`text-sm mb-1 ${balance > 0 ? "text-red-600" : "text-green-600"}`}>Balance</p>
              <p className={`text-2xl font-bold ${balance > 0 ? "text-red-700" : "text-green-700"}`}>
                KES {Math.abs(balance).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payment Status */}
          {currentPayment && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                {currentPayment.status === "paid" ? "✓ Payment Received" : "⏰ Payment Pending"}
              </p>
              {currentPayment.status === "paid" && (
                <>
                  <p className="text-sm text-blue-700 mt-1">M-Pesa Code: {currentPayment.mpesa_code}</p>
                  <p className="text-sm text-blue-700">
                    Paid on: {new Date(currentPayment.paid_date).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
