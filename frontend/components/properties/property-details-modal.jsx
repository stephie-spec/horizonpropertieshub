"use client"

export default function PropertyDetailsModal({ propertyId, onClose, data }) {
  const property = data.properties.find((p) => p.id === propertyId)
  const units = data.units.filter((u) => u.property_id === propertyId)

  if (!property) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{property.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 text-sm">Location: {property.location}</p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">Units</h3>
          <div className="space-y-2">
            {units.map((unit) => (
              <div key={unit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Unit {unit.unit_number}</p>
                  <p className="text-sm text-gray-600">KES {unit.rent_amount.toLocaleString()}/month</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    unit.status === "occupied" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
