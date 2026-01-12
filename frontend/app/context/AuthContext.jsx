"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Mock authentication
    const mockUser = {
      id: "1",
      email,
      name: email.split("@")[0],
      phone: "+254712345678",
    }
    localStorage.setItem("user", JSON.stringify(mockUser))
    setUser(mockUser)
    router.push("/dashboard")
  }

  const signup = (name, email, phone, password) => {
    const mockUser = {
      id: Math.random().toString(),
      email,
      name,
      phone,
    }
    localStorage.setItem("user", JSON.stringify(mockUser))
    setUser(mockUser)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
