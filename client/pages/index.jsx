import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("landlord")
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="inline-block bg-blue-600 text-white rounded-full p-4 mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Property Manager</h1>
          <p className="text-xl text-gray-600 mb-6">
            Efficiently manage your properties, units, tenants, and payments all in one place
          </p>
          <p className="text-gray-600 mb-8">
            Track rent payments, manage tenant information, monitor unit status, and streamline your property business.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-lg border-2 border-blue-600 transition">
              Register
            </button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🏠", title: "Properties", desc: "Manage all your properties" },
            { icon: "🔑", title: "Units", desc: "Track unit status & assignments" },
            { icon: "💰", title: "Payments", desc: "Monitor rent & payments" },
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
