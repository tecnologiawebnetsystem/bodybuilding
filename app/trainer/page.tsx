"use client"

import TrainerDashboard from "@/components/trainer-dashboard"
import { PageLayout } from "@/components/page-layout"
import { PageContainer } from "@/components/page-container"

export default function TrainerPage() {
  const trainerId = "pt_carlos"

  return (
    <PageLayout title="Painel Personal Trainer" backTo="more">
      <PageContainer
        title="Painel Personal Trainer"
        subtitle="Gerencie seus alunos e acompanhe o progresso"
        badge="Pro"
        maxWidth="full"
      >
        <TrainerDashboard trainerId={trainerId} />
      </PageContainer>
    </PageLayout>
  )
}
