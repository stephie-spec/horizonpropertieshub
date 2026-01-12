"use client"

import { useState } from "react"

export default function UnitsTable({ units, properties }) {
  const getPropertyName = (propertyId) => {
    return properties.find((p) => p.id === propertyId)?.name || "Unknown"
  }

  const [sortBy, setSortBy] = useState("property")

  const sortedUnits = [...units].sort((a, b) => {
    if (sortBy === "property") {
      return getPropertyName(a.property_id).localeCompare(getPropertyName(b.property_id))
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status)
    } else if (sortBy === "rent") {
      return a.rent_amount - b.rent_amount
    }
    return 0
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy("property")}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            sortBy === "property" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sort by Property
        </button>
        <button
          onClick={() => setSortBy("status")}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            sortBy === "status" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sort by Status
        </button>
        <button
          onClick={() => setSortBy("rent")}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            sortBy === "rent" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sort by Rent
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Property</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit Number</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Monthly Rent</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedUnits.map((unit) => (
              <tr key={unit.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{getPropertyName(unit.property_id)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{unit.unit_number}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">KES {unit.rent_amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      unit.status === "occupied" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
