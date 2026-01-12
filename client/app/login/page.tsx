"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.emailOrPhone || !formData.password) {
      setError("All fields are required")
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.emailOrPhone,
          name: "John Mwangi",
        }),
      )
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-primary hover:text-primary/80">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Building2 className="w-12 h-12 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Login to your PropertyPro account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email or Phone</label>
              <Input
                type="text"
                name="emailOrPhone"
                placeholder="your@email.com or +254712345678"
                value={formData.emailOrPhone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                <label htmlFor="remember" className="text-sm">
                  Remember me
                </label>
              </div>
              <Link href="#" className="text-sm text-secondary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-secondary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
