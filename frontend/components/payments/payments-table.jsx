"use client"

export default function PaymentsTable({ payments, tenants }) {
  const getTenantName = (tenantId) => {
    return tenants.find((t) => t.id === tenantId)?.name || "Unknown"
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tenant</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Month</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Year</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">M-Pesa Code</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Paid Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{getTenantName(payment.tenant_id)}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{payment.month}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{payment.year}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">KES {payment.amount.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{payment.mpesa_code || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {payment.paid_date ? new Date(payment.paid_date).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payment.status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status === "paid" ? "✓ Paid" : "✕ Unpaid"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
