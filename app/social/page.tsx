"use client"

import { SocialFeed } from "@/components/social-feed"
import { PageLayout } from "@/components/page-layout"
import { PageContainer } from "@/components/page-container"
import { useEffect, useState } from "react"

export default function SocialPage() {
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser")
    if (currentUser) {
      setUserId(currentUser)
    }
  }, [])

  return (
    <PageLayout title="Feed Social" backTo="more">
      <PageContainer title="Feed Social" subtitle="Veja o que seus amigos estão fazendo" maxWidth="lg">
        <SocialFeed userId={userId} />
      </PageContainer>
    </PageLayout>
  )
}
