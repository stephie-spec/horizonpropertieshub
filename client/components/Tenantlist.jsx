import { useState, useEffect } from "react"

export default function TenantModal({ isOpen, tenant, onClose, onSave }) {
  const [tenants, setTenants] = useState([])
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  //fech tenants
  const fetchTenants = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5555/tenants")
      const data = await res.json()
      setTenants(data)
    } catch (err) {
      console.error("Error fetching tenants:", err)
    }
  }
  useEffect(() => {
    fetchTenants()
  }, [])
  //handle open modal for editing and adding tenant
  const handleOpenModal = (tenant = null) => {
    setSelectedTenant(tenant)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedTenant(null)
    setIsModalOpen(false)
  }
  //Create/ update tenant
  const handleSaveTenant = async (tenantData) => {
    let url = "http://127.0.0.1:5555/tenants"
    let method = "POST"

    if (tenantData.id) {
      url = `http://127.0.0.1:5555/tenants/${tenantData.id}`
      method = "PUT"
    }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tenantData),
    })

    if (response.ok) {
      fetchTenants()
    } else {
      console.error("Failed to save tenant")
    }
  }
  //delete tenant
  const handleDeleteTenant = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return

    const response = await fetch(`http://127.0.0.1:5555/tenants/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setTenants(tenants.filter((t) => t.id !== id))
    }
  }
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    id_number: "",
    email: "",
  })

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        phone: tenant.phone,
        id_number: tenant.id_number,
        email: tenant.email,
      })
    } else {
      setFormData({
        name: "",
        phone: "",
        id_number: "",
        email: "",
      })
    }
  }, [tenant, isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{tenant ? "Edit Tenant" : "Add Tenant"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+254712345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
            <input
              type="text"
              name="id_number"
              value={formData.id_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 12345678"
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
              {tenant ? "Update" : "Add"} Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
