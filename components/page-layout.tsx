"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  showBackButton?: boolean
  backTo?: "more" | "dashboard"
  backLabel?: string
}

export function PageLayout({ children, title, showBackButton = true, backTo = "more", backLabel }: PageLayoutProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleBack = () => {
    if (backTo === "more") {
      // Salva a aba "more" no sessionStorage para o dashboard abrir nela
      sessionStorage.setItem("activeTab", "more")
      router.push("/")
    } else {
      router.push("/")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const buttonLabel = backLabel || (backTo === "more" ? "Voltar para Mais" : "Voltar ao Dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header com navegação */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          {showBackButton && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {buttonLabel}
            </Button>
          )}
          {title && <h1 className="text-xl font-bold">{title}</h1>}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-6">{children}</div>
    </div>
  )
}
