"use client"

import { useState, useEffect } from "react"
import { getMockData } from "../../../lib/mock-data"
import PageHeader from "../../../components/page-header"
import TenantsTable from "../../../components/tenants/tenants-table"

export default function TenantsPage() {
  const [data, setData] = useState(null)
  const [selectedTenant, setSelectedTenant] = useState(null)

  useEffect(() => {
    setData(getMockData())
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader title="Tenants" description="View all your active tenants and their details" icon="👥" />
      <div className="p-6">
        <TenantsTable
          tenants={data.tenants}
          units={data.units}
          payments={data.payments}
          onSelectTenant={setSelectedTenant}
        />
      </div>
      {selectedTenant && <TenantDetailsPanel tenant={selectedTenant} units={data.units} payments={data.payments} />}
    </div>
  )
}

function TenantDetailsPanel({ tenant, units, payments }) {
  const unit = units.find((u) => u.id === tenant.unit_id)
  const tenantPayments = payments.filter((p) => p.tenant_id === tenant.id)
  const totalPaid = tenantPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const totalDue = tenantPayments.filter((p) => p.status === "unpaid").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto z-40">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{tenant.name}</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Phone:</span> {tenant.phone}
              </p>
              <p>
                <span className="text-gray-600">ID Number:</span> {tenant.id_number}
              </p>
              <p>
                <span className="text-gray-600">Move-in Date:</span>{" "}
                {new Date(tenant.move_in_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Unit Information</h3>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Unit {unit?.unit_number}</p>
              <p className="text-sm text-gray-600">KES {unit?.rent_amount.toLocaleString()}/month</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Total Paid</p>
                <p className="text-lg font-bold text-green-700">KES {totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Total Due</p>
                <p className="text-lg font-bold text-red-700">KES {totalDue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Payments</h3>
            <div className="space-y-2">
              {tenantPayments.slice(0, 5).map((payment, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                  <span>
                    {payment.month} {payment.year}
                  </span>
                  <span
                    className={payment.status === "paid" ? "text-green-600 font-medium" : "text-red-600 font-medium"}
                  >
                    {payment.status === "paid" ? "✓" : "✕"} KES {payment.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
