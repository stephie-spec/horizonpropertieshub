import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import UnitModal from "../components/UnitModal"
import { mockUnits, mockProperties, mockTenants } from "../lib/mockData"
import { toast } from "react-toastify"

export default function Units() {
  const router = useRouter()
  const [landlord, setLandlord] = useState(null)
  const [units, setUnits] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [filterProperty, setFilterProperty] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("landlord")
    if (!user) {
      router.push("/login")
    } else {
      setLandlord(JSON.parse(user))
      setUnits(mockUnits)
    }
  }, [router])

  const handleAddUnit = () => {
    setEditingUnit(null)
    setShowModal(true)
  }

  const handleEditUnit = (unit) => {
    setEditingUnit(unit)
    setShowModal(true)
  }

  const handleSaveUnit = (formData) => {
    if (editingUnit) {
      const index = mockUnits.findIndex((u) => u.id === editingUnit.id)
      mockUnits[index] = { ...editingUnit, ...formData }
      toast.success("Unit updated successfully!")
    } else {
      const newUnit = {
        id: Math.max(...mockUnits.map((u) => u.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString(),
      }
      mockUnits.push(newUnit)
      toast.success("Unit added successfully!")
    }
    setUnits([...mockUnits])
    setShowModal(false)
  }

  const handleDeleteUnit = (id) => {
    const index = mockUnits.findIndex((u) => u.id === id)
    mockUnits.splice(index, 1)
    toast.success("Unit deleted successfully!")
    setUnits([...mockUnits])
    setDeleteId(null)
  }

  if (!landlord) return null

  let filteredUnits = units
  if (filterProperty) {
    filteredUnits = filteredUnits.filter((u) => u.property_id === Number.parseInt(filterProperty))
  }
  if (filterStatus) {
    filteredUnits = filteredUnits.filter((u) => u.status === filterStatus)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Units</h1>
            <p className="text-gray-600 mt-2">Manage rental units</p>
          </div>
          <button
            onClick={handleAddUnit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            + Add Unit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Properties</option>
            {mockProperties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Property</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tenant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => {
                  const property = mockProperties.find((p) => p.id === unit.property_id)
                  const tenant = unit.tenant_id ? mockTenants.find((t) => t.id === unit.tenant_id) : null
                  return (
                    <tr key={unit.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{unit.unit_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{property?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tenant?.name || "Vacant"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">KES {unit.rent_amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${unit.status === "occupied" ? "bg-green-100 text-green-800" : unit.status === "available" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleEditUnit(unit)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(unit.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <UnitModal isOpen={showModal} unit={editingUnit} onClose={() => setShowModal(false)} onSave={handleSaveUnit} />

        {deleteId && (
          <ConfirmModal
            title="Delete Unit"
            message="Are you sure you want to delete this unit?"
            onConfirm={() => handleDeleteUnit(deleteId)}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </div>
    </Layout>
  )
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
