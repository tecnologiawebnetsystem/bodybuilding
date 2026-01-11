import { SubscriptionPlans } from "@/components/subscription-plans"

export default function PricingPage() {
  // TODO: Get userId from session/auth
  const userId = "kleber" // Placeholder

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Escolha seu Plano</h1>
          <p className="text-xl text-muted-foreground">Planos flexíveis para todos os objetivos</p>
        </div>

        <SubscriptionPlans userId={userId} />
      </div>
    </div>
  )
}
