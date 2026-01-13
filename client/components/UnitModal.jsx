"use client"

import { useState, useEffect } from "react"
import { mockProperties, mockTenants } from "../lib/mockData"

export default function UnitModal({ isOpen, unit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    unit_number: "",
    property_id: "",
    rent_amount: "",
    status: "available",
    tenant_id: "",
    move_in_date: "",
    move_out_date: "",
  })

  useEffect(() => {
    if (unit) {
      setFormData({
        unit_number: unit.unit_number,
        property_id: unit.property_id,
        rent_amount: unit.rent_amount,
        status: unit.status,
        tenant_id: unit.tenant_id || "",
        move_in_date: unit.move_in_date || "",
        move_out_date: unit.move_out_date || "",
      })
    } else {
      setFormData({
        unit_number: "",
        property_id: "",
        rent_amount: "",
        status: "available",
        tenant_id: "",
        move_in_date: "",
        move_out_date: "",
      })
    }
  }, [unit, isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{unit ? "Edit Unit" : "Add Unit"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit Number</label>
            <input
              type="text"
              name="unit_number"
              value={formData.unit_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Unit 101"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
            <select
              name="property_id"
              value={formData.property_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Property</option>
              {mockProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rent Amount</label>
            <input
              type="number"
              name="rent_amount"
              value={formData.rent_amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 15000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Tenant (Optional)</label>
            <select
              name="tenant_id"
              value={formData.tenant_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Tenant</option>
              {mockTenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Move-in Date</label>
            <input
              type="date"
              name="move_in_date"
              value={formData.move_in_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {unit ? "Update" : "Add"} Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
