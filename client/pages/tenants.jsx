import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import TenantModal from "../components/TenantModal"
import { mockTenants, mockUnits } from "../lib/mockData"
import { toast } from "react-toastify"

export default function Tenants() {
  const router = useRouter()
  const [landlord, setLandlord] = useState(null)
  const [tenants, setTenants] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingTenant, setEditingTenant] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("landlord")
    if (!user) {
      router.push("/login")
    } else {
      setLandlord(JSON.parse(user))
      setTenants(mockTenants)
    }
  }, [router])

  const handleAddTenant = () => {
    setEditingTenant(null)
    setShowModal(true)
  }

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant)
    setShowModal(true)
  }

  const handleSaveTenant = (formData) => {
    if (editingTenant) {
      const index = mockTenants.findIndex((t) => t.id === editingTenant.id)
      mockTenants[index] = { ...editingTenant, ...formData }
      toast.success("Tenant updated successfully!")
    } else {
      const newTenant = {
        id: Math.max(...mockTenants.map((t) => t.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString(),
      }
      mockTenants.push(newTenant)
      toast.success("Tenant added successfully!")
    }
    setTenants([...mockTenants])
    setShowModal(false)
  }

  const handleDeleteTenant = (id) => {
    const index = mockTenants.findIndex((t) => t.id === id)
    mockTenants.splice(index, 1)
    toast.success("Tenant deleted successfully!")
    setTenants([...mockTenants])
    setDeleteId(null)
  }

  if (!landlord) return null

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery),
  )

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Tenants</h1>
            <p className="text-gray-600 mt-2">Manage your tenants</p>
          </div>
          <button
            onClick={handleAddTenant}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            + Add Tenant
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => {
                  const unit = mockUnits.find((u) => u.tenant_id === tenant.id)
                  return (
                    <tr key={tenant.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{tenant.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tenant.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tenant.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tenant.id_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{unit ? unit.unit_number : "Unassigned"}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleEditTenant(tenant)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(tenant.id)}
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

        <TenantModal
          isOpen={showModal}
          tenant={editingTenant}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTenant}
        />

        {deleteId && (
          <ConfirmModal
            title="Delete Tenant"
            message="Are you sure you want to delete this tenant?"
            onConfirm={() => handleDeleteTenant(deleteId)}
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
