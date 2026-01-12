"use client"

import { SubscriptionPlans } from "@/components/subscription-plans"
import { PageLayout } from "@/components/page-layout"
import { PageContainer } from "@/components/page-container"
import { useEffect, useState } from "react"

export default function PricingPage() {
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser")
    if (currentUser) {
      setUserId(currentUser)
    }
  }, [])

  return (
    <PageLayout title="Escolha seu Plano" backTo="more">
      <PageContainer title="Escolha seu Plano" subtitle="Planos flexíveis para todos os objetivos" maxWidth="full">
        <SubscriptionPlans userId={userId} />
      </PageContainer>
    </PageLayout>
  )
}
