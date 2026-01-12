"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, Crown, Trophy } from "lucide-react"

interface Plan {
  plan_id: string
  plan_name: string
  description: string
  price_monthly: number | string
  price_yearly: number | string
  features: string[]
  max_users: number | null
}

export function SubscriptionPlans({ userId, currentPlan }: { userId: string; currentPlan?: string }) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [userRole, setUserRole] = useState<string>("student")

  useEffect(() => {
    fetchPlans()
    fetchUserRole()
  }, [])

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`/api/user/role?userId=${userId}`)
      const data = await response.json()
      if (data.role) {
        setUserRole(data.role)
      }
    } catch (error) {
      console.error("[v0] Error fetching user role:", error)
    }
  }

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/subscriptions/plans")
      const data = await response.json()
      setPlans(data.plans)
    } catch (error) {
      console.error("[v0] Error fetching plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch("/api/subscriptions/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          planId,
          billingCycle,
          paymentMethod: "pix",
        }),
      })

      if (response.ok) {
        alert("Assinatura criada com sucesso!")
        window.location.reload()
      }
    } catch (error) {
      console.error("[v0] Error subscribing:", error)
      alert("Erro ao criar assinatura")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando planos...</div>
  }

  const getPrice = (plan: Plan) => {
    const price = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly
    return typeof price === "string" ? Number.parseFloat(price) : price
  }

  const getSavings = (plan: Plan) => {
    const monthlyPrice =
      typeof plan.price_monthly === "string" ? Number.parseFloat(plan.price_monthly) : plan.price_monthly
    const yearlyPrice = typeof plan.price_yearly === "string" ? Number.parseFloat(plan.price_yearly) : plan.price_yearly
    const yearlyMonthly = monthlyPrice * 12
    const savings = yearlyMonthly - yearlyPrice
    return savings > 0 ? Math.round(savings) : 0
  }

  const filteredPlans = plans
    .filter((plan) => {
      if (userRole === "gym_owner") return true
      return !plan.plan_id.startsWith("gym_")
    })
    .sort((a, b) => {
      const order = ["free", "premium", "plus", "elite", "gym_basic", "gym_pro"]
      return order.indexOf(a.plan_id) - order.indexOf(b.plan_id)
    })

  const planStyles: Record<string, { icon: any; gradient: string; badge?: string; badgeColor?: string }> = {
    free: { icon: Check, gradient: "from-slate-500 to-slate-600" },
    premium: {
      icon: Sparkles,
      gradient: "from-blue-500 to-blue-600",
      badge: "Popular",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    plus: {
      icon: Zap,
      gradient: "from-purple-500 to-purple-600",
      badge: "Melhor Custo-Benefício",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    elite: {
      icon: Crown,
      gradient: "from-amber-500 to-amber-600",
      badge: "Profissional",
      badgeColor: "bg-amber-100 text-amber-700",
    },
    gym_basic: { icon: Trophy, gradient: "from-teal-500 to-teal-600" },
    gym_pro: { icon: Trophy, gradient: "from-emerald-500 to-emerald-600" },
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-full">
          <Button
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingCycle("monthly")}
            className="rounded-full"
          >
            Mensal
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingCycle("yearly")}
            className="rounded-full"
          >
            Anual
          </Button>
        </div>
        {billingCycle === "yearly" && (
          <Badge variant="secondary" className="bg-green-100 text-green-700 px-4 py-1">
            🎉 Economize até 17% no plano anual
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.plan_id
          const isFree = plan.plan_id === "free"
          const price = getPrice(plan)
          const savings = getSavings(plan)
          const style = planStyles[plan.plan_id] || planStyles.free
          const Icon = style.icon

          return (
            <Card
              key={plan.plan_id}
              className={`relative overflow-hidden transition-all hover:shadow-xl ${
                isCurrentPlan ? "ring-2 ring-primary shadow-lg scale-105" : ""
              }`}
            >
              <div className={`h-32 bg-gradient-to-br ${style.gradient} p-6 relative`}>
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                {style.badge && !isCurrentPlan && (
                  <Badge className={`absolute top-4 left-4 ${style.badgeColor}`}>{style.badge}</Badge>
                )}
                {isCurrentPlan && <Badge className="absolute top-4 left-4 bg-white text-primary">Plano Atual</Badge>}
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{plan.plan_name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">R$ {price.toFixed(2)}</span>
                    <span className="text-muted-foreground">/{billingCycle === "yearly" ? "ano" : "mês"}</span>
                  </div>
                  {billingCycle === "yearly" && savings > 0 && (
                    <p className="text-sm text-green-600 font-medium mt-2">💰 Economize R$ {savings} por ano</p>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {!(isFree && isCurrentPlan) && (
                  <Button
                    className={`w-full ${isCurrentPlan ? "" : `bg-gradient-to-r ${style.gradient} hover:opacity-90`}`}
                    onClick={() => handleSubscribe(plan.plan_id)}
                    disabled={isCurrentPlan}
                    size="lg"
                  >
                    {isCurrentPlan ? "✓ Seu Plano Atual" : isFree ? "Continuar Gratuito" : "Assinar Agora"}
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
