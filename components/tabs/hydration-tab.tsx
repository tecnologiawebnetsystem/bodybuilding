"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Droplet, Plus, Minus } from "lucide-react"
import { userProfiles } from "@/lib/user-profiles"

interface HydrationTabProps {
  userId: string
}

export function HydrationTab({ userId }: HydrationTabProps) {
  const profile = userProfiles[userId]
  const [waterIntake, setWaterIntake] = useState(0)
  const [goal, setGoal] = useState(3000)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHydration()
  }, [userId])

  const loadHydration = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const response = await fetch(`/api/hydration?userId=${userId}&date=${today}`)
      const data = await response.json()
      if (data.success) {
        setWaterIntake(data.data.water_intake_ml || 0)
        setGoal(data.data.goal_ml || 3000)
      }
    } catch (error) {
      console.error("[v0] Error loading hydration:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateHydration = async (newIntake: number) => {
    try {
      const today = new Date().toISOString().split("T")[0]
      await fetch("/api/hydration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: today,
          waterIntakeMl: newIntake,
          goalMl: goal,
        }),
      })
      setWaterIntake(newIntake)
    } catch (error) {
      console.error("[v0] Error updating hydration:", error)
    }
  }

  const addWater = (ml: number) => {
    updateHydration(Math.min(waterIntake + ml, 10000))
  }

  const removeWater = (ml: number) => {
    updateHydration(Math.max(waterIntake - ml, 0))
  }

  const progressPercent = Math.min(100, (waterIntake / goal) * 100)

  if (loading) {
    return <p className="text-center py-8">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hidratação Diária</h2>

      <Card className="p-8 border-2" style={{ borderColor: profile.theme.accent + "30" }}>
        <div className="text-center mb-6">
          <Droplet className="w-16 h-16 mx-auto mb-4" style={{ color: profile.theme.accent }} />
          <p className="text-6xl font-bold mb-2" style={{ color: profile.theme.primary }}>
            {waterIntake}ml
          </p>
          <p className="text-muted-foreground">de {goal}ml</p>
        </div>

        <Progress value={progressPercent} className="h-4 mb-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => addWater(250)}
            style={{ backgroundColor: profile.theme.accent }}
            className="h-20 flex-col gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">+250ml</span>
            <span className="text-xs opacity-80">Copo</span>
          </Button>
          <Button
            onClick={() => addWater(500)}
            style={{ backgroundColor: profile.theme.accent }}
            className="h-20 flex-col gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">+500ml</span>
            <span className="text-xs opacity-80">Garrafa</span>
          </Button>
          <Button
            onClick={() => addWater(1000)}
            style={{ backgroundColor: profile.theme.accent }}
            className="h-20 flex-col gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">+1L</span>
            <span className="text-xs opacity-80">Garrafa</span>
          </Button>
          <Button onClick={() => removeWater(250)} variant="outline" className="h-20 flex-col gap-2">
            <Minus className="w-5 h-5" />
            <span className="text-sm">-250ml</span>
            <span className="text-xs opacity-80">Corrigir</span>
          </Button>
        </div>

        {progressPercent >= 100 && (
          <div className="mt-6 p-4 bg-success/20 rounded-lg text-center">
            <p className="font-bold text-success">Parabéns! Meta de hidratação alcançada hoje!</p>
          </div>
        )}
      </Card>

      <Card className="p-6" style={{ backgroundColor: profile.theme.accent + "10" }}>
        <h3 className="font-bold mb-4">Por que hidratar?</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-success">✓</span>
            <span>Melhora o desempenho nos treinos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success">✓</span>
            <span>Acelera a recuperação muscular</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success">✓</span>
            <span>Auxilia na queima de gordura</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success">✓</span>
            <span>Melhora a digestão e absorção de nutrientes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success">✓</span>
            <span>Reduz retenção de líquidos</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
