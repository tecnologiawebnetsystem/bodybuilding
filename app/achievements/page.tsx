"use client"

import { AchievementsGrid } from "@/components/achievements-grid"
import { PageLayout } from "@/components/page-layout"
import { PageContainer } from "@/components/page-container"
import { useEffect, useState } from "react"

export default function AchievementsPage() {
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser")
    if (currentUser) {
      setUserId(currentUser)
    }
  }, [])

  return (
    <PageLayout title="Conquistas" backTo="more">
      <PageContainer
        title="Conquistas e Badges"
        subtitle="Complete desafios e desbloqueie conquistas para ganhar pontos e badges exclusivos"
        maxWidth="xl"
      >
        <AchievementsGrid userId={userId} />
      </PageContainer>
    </PageLayout>
  )
}
