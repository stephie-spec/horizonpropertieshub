"use client"

import { useState } from "react"
import Link from "next/link"
import { useToast } from "../../context/ToastContext"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      addToast("Please enter your email", "error")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      addToast("Reset link sent to your email", "success")
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive a reset link</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-4 text-green-600 text-lg">✓</div>
              <p className="text-gray-700 mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-gray-600 text-sm mb-6">
                Check your email and follow the instructions to reset your password.
              </p>
              <Button onClick={() => setSubmitted(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Send Another Link
              </Button>
            </div>
          )}

          <div className="mt-6 border-t pt-6">
            <p className="text-center text-gray-600 text-sm">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
