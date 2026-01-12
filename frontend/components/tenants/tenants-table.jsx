"use client"

import { formatPhoneNumber } from "../../lib/utils"

export default function TenantsTable({ tenants, units, payments, onSelectTenant }) {
  const getUnitNumber = (unitId) => {
    return units.find((u) => u.id === unitId)?.unit_number || "Unknown"
  }

  const getTenantStatus = (tenantId) => {
    const tenantPayments = payments.filter((p) => p.tenant_id === tenantId)
    const unpaidCount = tenantPayments.filter((p) => p.status === "unpaid").length
    return unpaidCount > 0 ? "pending" : "current"
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tenant Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID Number</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Move-in Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{tenant.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{formatPhoneNumber(tenant.phone)}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{getUnitNumber(tenant.unit_id)}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{tenant.id_number}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{new Date(tenant.move_in_date).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getTenantStatus(tenant.id) === "current"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {getTenantStatus(tenant.id) === "current" ? "Current" : "Payment Pending"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => onSelectTenant(tenant)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
