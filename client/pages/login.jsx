import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { toast } from "react-toastify"


export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
   
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required")
      return
    }
    
    setLoading(true)

    try {

      const response = await fetch("http://localhost:5555/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Login response:", data) 
        
        localStorage.setItem(
          "landlord",
          JSON.stringify({
            id: data.landlord?.id || data.id || 1, 
            email: data.landlord?.email || formData.email,
            name: data.landlord?.name || "Landlord",
          })
        )
        toast.success("Login successful")
        router.push("/dashboard")
      } else {
        toast.error(data.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Server error")
    }

    setLoading(false)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Email: john@example.com</p>
          <p className="text-xs text-gray-600">Password: password123</p>
        </div>
      </div>
    </div>
  )
}
