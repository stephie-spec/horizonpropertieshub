"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, DollarSign, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const stats = [
    { icon: Building2, label: "Total Properties", value: "8", color: "text-secondary" },
    { icon: Users, label: "Active Tenants", value: "24", color: "text-accent" },
    { icon: DollarSign, label: "Monthly Revenue", value: "KSh 450,000", color: "text-green-500" },
    { icon: AlertCircle, label: "Pending Payments", value: "5", color: "text-yellow-500" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Landlord"}!</h1>
        <p className="text-muted-foreground mt-2">Here's your property management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/dashboard/properties">
                <Building2 className="w-4 h-4 mr-2" />
                Add New Property
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/dashboard/tenants">
                <Users className="w-4 h-4 mr-2" />
                Add New Tenant
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/dashboard/payments">
                <DollarSign className="w-4 h-4 mr-2" />
                Record Payment
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="border border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { tenant: "Jane Kariuki", amount: "KSh 50,000", date: "Dec 15", status: "Paid" },
                { tenant: "David Omondi", amount: "KSh 45,000", date: "Dec 14", status: "Paid" },
                { tenant: "Sarah Kipchoge", amount: "KSh 55,000", date: "Dec 10", status: "Pending" },
              ].map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{payment.tenant}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount}</p>
                    <p className={`text-sm ${payment.status === "Paid" ? "text-green-500" : "text-yellow-500"}`}>
                      {payment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
