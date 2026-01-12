"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../app/context/AuthContext"
import { useState } from "react"

export default function Sidebar({ user }) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/properties", label: "Properties", icon: "🏠" },
    { href: "/units", label: "Units", icon: "🚪" },
    { href: "/tenants", label: "Tenants", icon: "👥" },
    { href: "/payments", label: "Payments", icon: "💰" },
    { href: "/statements", label: "Statements", icon: "📄" },
    { href: "/notifications", label: "Notifications", icon: "🔔" },
  ]

  const isActive = (href) => pathname === href

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div
      className={`${isOpen ? "w-64" : "w-20"} bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-blue-500">
        <div className="flex items-center justify-center">
          <div className="text-2xl font-bold">📱</div>
          {isOpen && <span className="ml-2 font-bold text-xl">PropertyHub</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-3 rounded-lg mb-2 transition-colors ${
              isActive(item.href)
                ? "bg-blue-500 bg-opacity-80 text-white"
                : "text-blue-100 hover:bg-blue-500 hover:bg-opacity-40"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-blue-500">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex-1">
              <div className="text-sm font-semibold truncate">{user?.name || "User"}</div>
              <div className="text-xs text-blue-200 truncate">{user?.email}</div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-blue-500 hover:bg-opacity-40 rounded"
            title={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? "◀" : "▶"}
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors text-center"
        >
          {isOpen ? "Logout" : "X"}
        </button>
      </div>
    </div>
  )
}
