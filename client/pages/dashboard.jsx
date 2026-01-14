import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Layout from "../components/Layout"
import { mockProperties, mockUnits } from "../lib/mockData"
const [payments, setPayments] = useState([])
const API_URL = "http://localhost:5555"
export default function Dashboard() {
  const router = useRouter()
  const [landlord, setLandlord] = useState(null)
  const [tenants, setTenants] = useState([])

  useEffect(() => {
    const user = localStorage.getItem("landlord")
    if (!user) {
      router.push("/login")
    } else {
      setLandlord(JSON.parse(user))
      fetchPayments()
    }
  }, [router])
  // Fetch tenants data from backend
  useEffect(() => {
    fetch(`${API_URL}/tenants`)
      .then((res) => res.json())
      .then((data) => setTenants(data))
      .catch((err) => console.error("Failed to fetch tenants", err))
  }, [])
const fetchPayments = async () => {
  try {
    const res = await fetch(`${API_URL}/payments`)
    if (!res.ok) throw new Error("Failed to fetch payments")

    const data = await res.json()
    setPayments(data)
  } catch (error) {
    console.error("Failed to load payments", error)
  }
}

  if (!landlord) return null

  const totalProperties = mockProperties.filter((p) => p.landlord_id === landlord.id).length
  const totalUnits = mockUnits.length
  const occupiedUnits = mockUnits.filter((u) => u.tenant_id !== null).length
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {landlord.name}!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Properties" value={totalProperties} icon="🏢" />
          <StatCard title="Total Units" value={totalUnits} icon="🔑" />
          <StatCard title="Occupancy Rate" value={`${occupancyRate}%`} icon="👥" />
          <StatCard title="Total Revenue" value={`KES ${totalRevenue.toLocaleString()}`} icon="💰" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href="/properties" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-2">🏠</div>
              <h3 className="font-bold text-gray-900">Manage Properties</h3>
              <p className="text-sm text-gray-600">Add, edit, or view properties</p>
            </div>
          </Link>

          <Link href="/units" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-2">🔑</div>
              <h3 className="font-bold text-gray-900">Manage Units</h3>
              <p className="text-sm text-gray-600">Track units and assignments</p>
            </div>
          </Link>

          <Link href="/payments" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-bold text-gray-900">Record Payment</h3>
              <p className="text-sm text-gray-600">Track rent payments</p>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tenant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => {
                  const tenant = mockTenants.find((t) => t.id === payment.tenant_id)
                  return (
                    <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{tenant?.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">KES {payment.amount.toLocaleString()}</td>
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
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
