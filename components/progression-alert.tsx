"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, TrendingUp } from "lucide-react"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface ProgressionAlertProps {
  userId: string
  preferences: UserPreferences
}

export function ProgressionAlert({ userId, preferences }: ProgressionAlertProps) {
  const [showAlert, setShowAlert] = useState(false)
  const [progression, setProgression] = useState<any>(null)

  useEffect(() => {
    checkProgression()
  }, [userId])

  const checkProgression = async () => {
    try {
      const response = await fetch(`/api/progression?userId=${userId}`)
      const result = await response.json()

      if (result.success && result.data) {
        const endDate = new Date(result.data.end_date)
        const today = new Date()
        const daysUntilEnd = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        setProgression(result.data)
        if (daysUntilEnd <= 7 && daysUntilEnd >= 0) {
          setShowAlert(true)
        }
      } else {
        await createFirstProgression()
      }
    } catch (error) {
      console.error("[v0] Error checking progression:", error)
    }
  }

  const createFirstProgression = async () => {
    try {
      await fetch("/api/progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          startDate: new Date().toISOString().split("T")[0],
          difficultyLevel: 1,
        }),
      })
    } catch (error) {
      console.error("[v0] Error creating first progression:", error)
    }
  }

  const handleNewCycle = async () => {
    try {
      const newLevel = (progression?.difficulty_level || 0) + 1
      await fetch("/api/progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          startDate: new Date().toISOString().split("T")[0],
          difficultyLevel: newLevel,
        }),
      })
      setShowAlert(false)
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error creating new cycle:", error)
    }
  }

  if (!showAlert) return null

  return (
    <Card className="border-2 mb-6" style={{ borderColor: preferences.theme_primary }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-6 h-6" style={{ color: preferences.theme_primary }} />
          Novo Ciclo de Treino Disponível!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">
          Seu ciclo atual está chegando ao fim! É hora de aumentar a intensidade e continuar evoluindo. Vamos para o
          próximo nível?
        </p>
        <div className="flex items-center gap-3">
          <div
            className="flex-1 text-center p-3 rounded-lg"
            style={{ backgroundColor: `${preferences.theme_primary}20` }}
          >
            <div className="text-2xl font-bold" style={{ color: preferences.theme_primary }}>
              Ciclo {progression?.cycle_number}
            </div>
            <div className="text-xs text-muted-foreground">Atual</div>
          </div>
          <TrendingUp className="w-8 h-8" style={{ color: preferences.theme_primary }} />
          <div
            className="flex-1 text-center p-3 rounded-lg"
            style={{ backgroundColor: `${preferences.theme_primary}20` }}
          >
            <div className="text-2xl font-bold" style={{ color: preferences.theme_primary }}>
              Ciclo {(progression?.cycle_number || 0) + 1}
            </div>
            <div className="text-xs text-muted-foreground">Próximo</div>
          </div>
        </div>
        <Button
          className="w-full"
          size="lg"
          style={{ backgroundColor: preferences.theme_primary }}
          onClick={handleNewCycle}
        >
          Iniciar Novo Ciclo (Nível {(progression?.difficulty_level || 0) + 1})
        </Button>
      </CardContent>
    </Card>
  )
}
