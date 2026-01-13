"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { toast } from "react-toastify"

export default function Layout({ children }) {
  const router = useRouter()
  const [landlord, setLandlord] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("landlord")
    if (user) {
      setLandlord(JSON.parse(user))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("landlord")
    toast.success("Logged out successfully!")
    router.push("/login")
  }

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Properties", href: "/properties", icon: "🏠" },
    { label: "Units", href: "/units", icon: "🔑" },
    { label: "Tenants", href: "/tenants", icon: "👥" },
    { label: "Payments", href: "/payments", icon: "💳" },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h2 className="text-xl font-bold">PropMgr</h2>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
            ☰
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition ${
                  router.pathname === link.href ? "bg-blue-600" : ""
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                {isSidebarOpen && <span>{link.label}</span>}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          {isSidebarOpen && (
            <div className="mb-4">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-medium text-white truncate">{landlord?.name}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
          >
            {isSidebarOpen ? "Logout" : "🚪"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
