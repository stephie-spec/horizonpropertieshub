import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import TenantModal from "../components/TenantModal"
import { toast } from "react-toastify"

const API_URL = "http://127.0.0.1:5555"

export default function Tenants() {
  const router = useRouter()
  const [units, setUnits] = useState([])G
  const [landlord, setLandlord] = useState(null)
  const [tenants, setTenants] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingTenant, setEditingTenant] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch landlord, tenants, and units
  useEffect(() => {
    const storedLandlord = JSON.parse(localStorage.getItem("landlord"))
    if (!storedLandlord) {
      router.push("/login")
      return
    }

    setLandlord(storedLandlord)
    fetchTenants(storedLandlord.id)
    fetchUnits(storedLandlord.id)
  }, [])

  const fetchTenants = async (landlordId) => {
    try {
      const res = await fetch(`${API_URL}/tenants?landlord_id=${landlordId}`)
      if (!res.ok) throw new Error("Failed to fetch tenants")
      const data = await res.json()
      setTenants(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load tenants")
    } finally {
      setLoading(false)
    }
  }

  const fetchUnits = async (landlordId) => {
    try {
      const res = await fetch(`${API_URL}/units?landlord_id=${landlordId}`)
      if (!res.ok) throw new Error("Failed to fetch units")
      const data = await res.json()
      setUnits(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load units")
    }
  }

  const handleAddTenant = () => {
    setEditingTenant(null)
    setShowModal(true)
  }

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant)
    setShowModal(true)
  }

  // Save tenant (create or update)
  const handleSaveTenant = async (formData) => {
    const method = editingTenant ? "PUT" : "POST"
    const url = editingTenant
      ? `${API_URL}/tenants/${editingTenant.id}`
      : `${API_URL}/tenants`

    const data = new FormData()
    data.append("name", formData.name)
    data.append("email", formData.email)
    data.append("phone", formData.phone)
    data.append("id_number", formData.id_number)
    data.append("landlord_id", landlord.id)

    try {
      const res = await fetch(url, {
        method,
        body: data
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Request failed")
      }

      const savedTenant = await res.json()
      
      // Update local state
      if (editingTenant) {
        setTenants((prev) =>
          prev.map((t) => (t.id === savedTenant.id ? savedTenant : t))
        )
        toast.success("Tenant updated successfully")
      } else {
        setTenants((prev) => [...prev, savedTenant])
        toast.success("Tenant added successfully")
      }

      setShowModal(false)
      setEditingTenant(null)
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Failed to save tenant")
      throw err // Re-throw to let modal handle the error
    }
  }

  // Delete tenant
  const handleDeleteTenant = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tenants/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete tenant")

      setTenants(tenants.filter(t => t.id !== id))
      toast.success("Tenant deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete tenant")
    } finally {
      setDeleteId(null)
    }
  }

  if (!landlord) return null

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.phone || "").includes(searchQuery)
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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading tenants...</p>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No tenants found</p>
            <button
              onClick={handleAddTenant}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first tenant
            </button>
          </div>
        ) : (
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
                    const unit = units.find((u) => u.tenant_id === tenant.id)
                    return (
                      <tr key={tenant.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{tenant.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{tenant.email || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{tenant.phone || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{tenant.id_number || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {unit ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {unit.unit_number}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Unassigned
                            </span>
                          )}
                        </td>
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
        )}

        <TenantModal
          isOpen={showModal}
          tenant={editingTenant}
          onClose={() => {
            setShowModal(false)
            setEditingTenant(null)
          }}
          onSave={handleSaveTenant}
        />

        {deleteId && (
          <ConfirmModal
            title="Delete Tenant"
            message="Are you sure you want to delete this tenant? This action cannot be undone."
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