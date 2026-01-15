import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, Users, TrendingUp, Calendar, Smartphone, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FitTransform</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/admin" className="text-gray-300 hover:text-white transition">
              Login Admin
            </Link>
            <Button size="sm" className="bg-gradient-to-r from-red-600 to-orange-500">
              <Link href="/app-mobile">Try App</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <span className="text-sm text-gray-300">🚀 Complete Gym Management System</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Transform Your <br />
          <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Gym Management
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Complete CRM system for gyms and personal trainers. Manage members, workouts, payments, and grow your business
          all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6">
            <Link href="/app-mobile" className="flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/5 text-lg px-8 py-6 bg-transparent"
          >
            <Link href="#features">View Features</Link>
          </Button>
        </div>

        {/* App Download Buttons */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-gray-400 text-sm">Download Mobile App</p>
          <div className="flex gap-4">
            <Link
              href="/app-mobile"
              className="flex items-center gap-3 px-6 py-3 bg-black border border-white/20 rounded-xl hover:bg-white/5 transition"
            >
              <Smartphone className="w-6 h-6 text-white" />
              <div className="text-left">
                <p className="text-xs text-gray-400">Download on</p>
                <p className="text-sm font-semibold text-white">Google Play</p>
              </div>
            </Link>
            <Link
              href="/app-mobile"
              className="flex items-center gap-3 px-6 py-3 bg-black border border-white/20 rounded-xl hover:bg-white/5 transition"
            >
              <Smartphone className="w-6 h-6 text-white" />
              <div className="text-left">
                <p className="text-xs text-gray-400">Download on</p>
                <p className="text-sm font-semibold text-white">App Store</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-gray-400 text-lg">Complete gym management in one powerful platform</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Member Management",
              desc: "Complete CRM with lead tracking, contracts, and automated communications",
            },
            {
              icon: Dumbbell,
              title: "Workout Planning",
              desc: "AI-powered workout generation and detailed exercise tracking for every member",
            },
            {
              icon: TrendingUp,
              title: "Financial Reports",
              desc: "Advanced analytics with revenue tracking, expenses, and profit analysis",
            },
            {
              icon: Calendar,
              title: "Class Scheduling",
              desc: "Group classes management with booking system and capacity control",
            },
            {
              icon: CheckCircle,
              title: "QR Code Check-in",
              desc: "Fast member check-in with QR code scanning and attendance tracking",
            },
            {
              icon: Smartphone,
              title: "Mobile App",
              desc: "Native iOS and Android apps for members to track progress anywhere",
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
              <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-gray-400 text-lg">Start free, upgrade as you grow</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Starter", price: "Free", features: ["Up to 50 members", "Basic features", "Mobile app access"] },
            {
              name: "Pro",
              price: "$49",
              features: ["Unlimited members", "All features", "Priority support", "Custom branding"],
              popular: true,
            },
            {
              name: "Enterprise",
              price: "Custom",
              features: ["Multiple locations", "Dedicated support", "Custom integrations"],
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl border ${plan.popular ? "bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500" : "bg-white/5 border-white/10"}`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-400">/month</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                <Link href="/app-mobile">Get Started</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FitTransform</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 FitTransform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
