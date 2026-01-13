"use client"

import { useState, useEffect } from "react"
import { mockTenants } from "../lib/mockData"

export default function PaymentModal({ isOpen, payment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    tenant_id: "",
    amount: "",
    mpesa_code: "",
    status: "pending",
    paid_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (payment) {
      setFormData({
        tenant_id: payment.tenant_id,
        amount: payment.amount,
        mpesa_code: payment.mpesa_code,
        status: payment.status,
        paid_date: payment.paid_date.split("T")[0],
      })
    } else {
      setFormData({
        tenant_id: "",
        amount: "",
        mpesa_code: "",
        status: "pending",
        paid_date: new Date().toISOString().split("T")[0],
      })
    }
  }, [payment, isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      tenant_id: Number.parseInt(formData.tenant_id),
      amount: Number.parseFloat(formData.amount),
      paid_date: new Date(formData.paid_date).toISOString(),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{payment ? "Edit Payment" : "Record Payment"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tenant</label>
            <select
              name="tenant_id"
              value={formData.tenant_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Tenant</option>
              {mockTenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 15000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Code</label>
            <input
              type="text"
              name="mpesa_code"
              value={formData.mpesa_code}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ABC1D2E3F"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
            <input
              type="date"
              name="paid_date"
              value={formData.paid_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
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
              {payment ? "Update" : "Record"} Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
