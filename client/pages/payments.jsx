"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import PaymentModal from "../components/PaymentModal"
import { mockPayments, mockTenants } from "../lib/mockData"
import { toast } from "react-toastify"

export default function Payments() {
  const router = useRouter()
  const [landlord, setLandlord] = useState(null)
  const [payments, setPayments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [filterStatus, setFilterStatus] = useState("")
  
  const API_URL = "http://localhost:5555"


  useEffect(() => {
    const user = localStorage.getItem("landlord")
    if (!user) {
      router.push("/login")
    } else {
      setLandlord(JSON.parse(user))
      setPayments(mockPayments)
    }
  }, [router])


  const handleAddPayment = () => {
    setEditingPayment(null)
    setShowModal(true)
  }

  const handleEditPayment = (payment) => {
    setEditingPayment(payment)
    setShowModal(true)
  }

  const handleSavePayment = (formData) => {
    if (editingPayment) {
      const index = mockPayments.findIndex((p) => p.id === editingPayment.id)
      mockPayments[index] = { ...editingPayment, ...formData }
      toast.success("Payment updated successfully!")
    } else {
      const newPayment = {
        id: Math.max(...mockPayments.map((p) => p.id), 0) + 1,
        ...formData,
      }
      mockPayments.push(newPayment)
      toast.success("Payment recorded successfully!")
    }
    setPayments([...mockPayments])
    setShowModal(false)
  }

  const handleDeletePayment = async (id) => {
  try {
    const res = await fetch(`${API_URL}/payments/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) throw new Error("Delete failed")

    setPayments(payments.filter((p) => p.id !== id))
    setDeleteId(null)
  } catch (error) {
    console.error("Failed to delete payment", error)
  }
}

  if (!landlord) return null

  const filteredPayments = filterStatus ? payments.filter((p) => p.status === filterStatus) : payments

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter((p) => p.status === "pending").length,
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-2">Track rent and other payments</p>
          </div>
          <button
            onClick={handleAddPayment}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            + Record Payment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Revenue" value={`KES ${stats.total.toLocaleString()}`} icon="💰" />
          <StatCard title="Completed" value={`KES ${stats.completed.toLocaleString()}`} icon="✅" />
          <StatCard title="Pending" value={stats.pending} icon="⏳" />
        </div>

        <div className="mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tenant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">M-Pesa Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const tenant = mockTenants.find((t) => t.id === payment.tenant_id)
                  return (
                    <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{tenant?.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">KES {payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{payment.mpesa_code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payment.paid_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(payment.id)}
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

        <PaymentModal
          isOpen={showModal}
          payment={editingPayment}
          onClose={() => setShowModal(false)}
          onSave={handleSavePayment}
        />

        {deleteId && (
          <ConfirmModal
            title="Delete Payment"
            message="Are you sure you want to delete this payment?"
            onConfirm={() => handleDeletePayment(deleteId)}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </div>
    </Layout>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
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
