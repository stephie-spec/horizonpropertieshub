import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import PropertyModal from "../components/PropertyModal"
import { mockProperties } from "../lib/mockData"
import { toast } from "react-toastify"

export default function Properties() {
  const router = useRouter()
  const [landlord, setLandlord] = useState(null)
  const [properties, setProperties] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem("landlord")
    if (!user) {
      router.push("/login")
    } else {
      const userData = JSON.parse(user)
      setLandlord(userData)
      fetch(`http://127.0.0.1:5555/properties?landlord_id=${userData.id}`)
        .then(res => res.json())
        .then(data => setProperties(data))
        .catch(err => console.error("Failed to fetch properties:", err))
    }
  }, [router])

  const handleAddProperty = () => {
    setEditingProperty(null)
    setShowModal(true)
  }

  const handleEditProperty = (property) => {
    setEditingProperty(property)
    setShowModal(true)
  }
  //save/ update
  const handleSaveProperty = async (formData) => {
    let url = "http://127.0.0.1:5555/properties"
    let method = "POST"
    if (editingProperty) {
      url = `http://127.0.0.1:5555/properties/${editingProperty.id}`
      method = "PUT"
    }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, landlord_id: landlord.id }),
    })
    const savedProperty = await response.json()

    setProperties((prev) =>
      editingProperty
        ? prev.map((p) => (p.id === savedProperty.id ? savedProperty : p))
        : [...prev, savedProperty]
    )
    setShowModal(false)
  }


  const handleDeleteProperty = async (id) => {
    const response = await fetch(`http://127.0.0.1:5555/properties/${id}`, { method: "DELETE" })
    if (response.ok) {
      setProperties(properties.filter((p) => p.id !== id))
    }
  }



  if (!landlord) return null

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-2">Manage your properties</p>
          </div>
          <button
            onClick={handleAddProperty}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            + Add Property
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{property.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{property.description}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEditProperty(property)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(property.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PropertyModal
          isOpen={showModal}
          property={editingProperty}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProperty}
        />

        {deleteId && (
          <ConfirmModal
            title="Delete Property"
            message="Are you sure you want to delete this property?"
            onConfirm={() => handleDeleteProperty(deleteId)}
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
