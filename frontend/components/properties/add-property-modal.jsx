"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function AddPropertyModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    units_count: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.location && formData.units_count) {
      onAdd({
        name: formData.name,
        location: formData.location,
        units_count: Number.parseInt(formData.units_count),
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
            <Input
              type="text"
              name="name"
              placeholder="e.g., Westlands Plaza"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <Input
              type="text"
              name="location"
              placeholder="e.g., Nairobi"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Units</label>
            <Input
              type="number"
              name="units_count"
              placeholder="e.g., 12"
              value={formData.units_count}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add Property
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
