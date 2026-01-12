"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Users, CreditCard, Bell, ArrowRight, Check } from "lucide-react"

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-secondary" />
            <span className="text-xl font-bold text-primary">PropertyPro</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-secondary hover:bg-secondary/90 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-balance">Manage Your Rental Properties in Kenya</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Simplify property management, tenant tracking, rent collection, and MPESA payments all in one platform.
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <Link href="/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-16 text-center">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building2, title: "Property Management", desc: "Track all your properties and units" },
              { icon: Users, title: "Tenant Tracking", desc: "Manage tenant information and contacts" },
              { icon: CreditCard, title: "Payment Records", desc: "Record rent payments with MPESA integration" },
              { icon: Bell, title: "Notifications", desc: "Stay updated with real-time alerts" },
            ].map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all cursor-pointer"
              >
                <feature.icon className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PropertyPro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Why PropertyPro Kenya?</h2>
        <div className="space-y-4">
          {[
            "Built specifically for Kenyan landlords and property managers",
            "Support for MPESA payments and KSh currency formatting",
            "Mobile-responsive design for on-the-go management",
            "Easy-to-use interface with no learning curve",
            "Secure data storage with complete control",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border border-border">
              <Check className="w-6 h-6 text-accent flex-shrink-0" />
              <span className="text-lg">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Simplify Property Management?</h2>
          <p className="text-lg opacity-90">Join Kenyan landlords who trust PropertyPro to manage their properties.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2025 PropertyPro Kenya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
