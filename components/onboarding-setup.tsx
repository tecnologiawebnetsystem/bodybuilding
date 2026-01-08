"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, Target, Zap } from "lucide-react"

interface OnboardingSetupProps {
  onComplete: () => void
}

export function OnboardingSetup({ onComplete }: OnboardingSetupProps) {
  const [weight, setWeight] = useState("93")
  const [height, setHeight] = useState("180")

  const handleStart = () => {
    const startDate = "2026-01-06"
    const profile = {
      weight: Number.parseFloat(weight),
      height: Number.parseFloat(height),
      targetWeight: 78,
      gender: "male",
      startDate,
      weightHistory: [
        {
          date: startDate,
          weight: Number.parseFloat(weight),
        },
      ],
    }

    localStorage.setItem("userProfile", JSON.stringify(profile))
    localStorage.setItem("workoutCheckins", JSON.stringify([]))
    localStorage.setItem("runningCheckins", JSON.stringify([]))

    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 border-2">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6">
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Sua Transformação Começa Aqui</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Objetivo: <span className="font-bold text-primary">-15kg</span> e ganho de massa magra
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Meta Final</p>
            <p className="text-2xl font-bold">78kg</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Início</p>
            <p className="text-2xl font-bold">06/01/2026</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Frequência</p>
            <p className="text-2xl font-bold">5x/semana</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Peso Atual (kg)</label>
            <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="text-lg h-12" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Altura (cm)</label>
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="text-lg h-12" />
          </div>
        </div>

        <Button onClick={handleStart} size="lg" className="w-full text-lg h-14">
          Começar Jornada 🔥
        </Button>
      </Card>
    </div>
  )
}
