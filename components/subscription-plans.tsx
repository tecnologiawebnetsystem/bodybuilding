"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface Plan {
  plan_id: string
  plan_name: string
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  max_users: number | null
}

export function SubscriptionPlans({ userId, currentPlan }: { userId: string; currentPlan?: string }) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    fetchPlans()
  }, [])

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
          paymentMethod: "pix", // Placeholder
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
    return billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly
  }

  const getSavings = (plan: Plan) => {
    const yearlyMonthly = plan.price_monthly * 12
    const savings = yearlyMonthly - plan.price_yearly
    return savings > 0 ? Math.round(savings) : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <Button variant={billingCycle === "monthly" ? "default" : "outline"} onClick={() => setBillingCycle("monthly")}>
          Mensal
        </Button>
        <Button variant={billingCycle === "yearly" ? "default" : "outline"} onClick={() => setBillingCycle("yearly")}>
          Anual
          <Badge variant="secondary" className="ml-2">
            Economize até 17%
          </Badge>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.plan_id
          const price = getPrice(plan)
          const savings = getSavings(plan)

          return (
            <Card key={plan.plan_id} className={isCurrentPlan ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.plan_name}
                  {isCurrentPlan && <Badge>Atual</Badge>}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">R$ {price.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">por {billingCycle === "yearly" ? "ano" : "mês"}</div>
                  {billingCycle === "yearly" && savings > 0 && (
                    <div className="text-sm text-green-600 font-medium mt-1">Economize R$ {savings}/ano</div>
                  )}
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleSubscribe(plan.plan_id)} disabled={isCurrentPlan}>
                  {isCurrentPlan ? "Plano Atual" : "Assinar Agora"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
