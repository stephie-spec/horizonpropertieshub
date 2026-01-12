"use client"

import { useState } from "react"
import PropertyDetailsModal from "./property-details-modal"

export default function PropertiesTable({ properties, data }) {
  const [selectedProperty, setSelectedProperty] = useState(null)

  const getTotalUnits = (propertyId) => {
    return data.units.filter((u) => u.property_id === propertyId).length
  }

  const getOccupiedUnits = (propertyId) => {
    return data.units.filter((u) => u.property_id === propertyId && u.status === "occupied").length
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Property Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Units</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Occupied</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vacant</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Occupancy Rate</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => {
              const total = getTotalUnits(property.id)
              const occupied = getOccupiedUnits(property.id)
              const rate = total > 0 ? ((occupied / total) * 100).toFixed(0) : 0

              return (
                <tr key={property.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{property.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{total}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {occupied}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {total - occupied}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{rate}%</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedProperty(property.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {selectedProperty && (
        <PropertyDetailsModal propertyId={selectedProperty} onClose={() => setSelectedProperty(null)} data={data} />
      )}
    </>
  )
}
