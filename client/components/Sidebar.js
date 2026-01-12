"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import styles from "../styles/dashboard.module.css"

export default function Sidebar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/properties", label: "Properties", icon: "🏢" },
    { href: "/units", label: "Units", icon: "🏠" },
    { href: "/tenants", label: "Tenants", icon: "👥" },
    { href: "/payments", label: "Payments", icon: "💳" },
    { href: "/notifications", label: "Notifications", icon: "🔔" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("currentLandlord")
    router.push("/")
  }

  return (
    <>
      <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarLogo}>PropertyPro</h2>
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${router.pathname === item.href ? styles.active : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>
    </>
  )
}
