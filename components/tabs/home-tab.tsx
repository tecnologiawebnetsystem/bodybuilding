"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Flame, TrendingDown, Calendar, CheckCircle2, Activity, LogOut } from "lucide-react"
import { userProfiles } from "@/lib/user-profiles"
import { ProgressionAlert } from "@/components/progression-alert"

interface HomeTabProps {
  userId: string
  onLogout: () => void
}

export function HomeTab({ userId, onLogout }: HomeTabProps) {
  const profile = userProfiles[userId]
  const [currentWeight, setCurrentWeight] = useState(profile.initialWeight)
  const [todayWorkout, setTodayWorkout] = useState<string | null>(null)
  const [hasWorkoutToday, setHasWorkoutToday] = useState(false)
  const [hasRunToday, setHasRunToday] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [userId, profile])

  const loadData = async () => {
    try {
      const weightResponse = await fetch(`/api/weight?userId=${userId}`)
      const weightData = await weightResponse.json()
      if (weightData.logs && weightData.logs.length > 0) {
        setCurrentWeight(Number.parseFloat(weightData.logs[0].weight))
      }

      const today = new Date().toISOString().split("T")[0]
      const checkinResponse = await fetch(`/api/checkin?userId=${userId}&limit=5`)
      const checkinData = await checkinResponse.json()

      if (checkinData.success) {
        const todayCheckins = checkinData.data.filter((c: any) => c.checkin_date.startsWith(today))
        setHasWorkoutToday(todayCheckins.some((c: any) => c.checkin_type === "workout"))
        setHasRunToday(todayCheckins.some((c: any) => c.checkin_type === "running"))
      }

      // Determine today's workout
      const dayOfWeek = new Date().getDay()
      const workoutSchedule: { [key: number]: string } = {
        0: "Descanso", // Sunday
        1: "Treino A", // Monday
        2: "Treino B", // Tuesday
        3: "Treino C", // Wednesday
        4: "Descanso", // Thursday
        5: "Treino A", // Friday
        6: "Treino B", // Saturday
      }
      setTodayWorkout(workoutSchedule[dayOfWeek])
    } catch (error) {
      console.error("[v0] Error loading home data:", error)
    } finally {
      setLoading(false)
    }
  }

  const weightLoss = profile.initialWeight - currentWeight
  const totalGoal = profile.initialWeight - profile.targetWeight
  const progressPercent = Math.max(0, Math.min(100, (weightLoss / totalGoal) * 100))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProgressionAlert userId={userId} />

      {/* Welcome Header */}
      <Card className="p-6 bg-gradient-to-r from-primary via-secondary to-accent text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Olá, {profile.name.split(" ")[0]}!</h1>
            <p className="text-white/90">Vamos conquistar seus objetivos hoje!</p>
          </div>
          <Button onClick={onLogout} variant="secondary" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </Card>

      {/* Hero Stats */}
      <Card className="p-6 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border-2 border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Peso Atual</p>
            <h2 className="text-4xl font-bold text-primary">{currentWeight.toFixed(1)}kg</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Meta</p>
            <h2 className="text-4xl font-bold text-accent">{profile.targetWeight}kg</h2>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-bold">
              {weightLoss.toFixed(1)}kg / {totalGoal}kg
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary/20">
          <div className="text-center">
            <TrendingDown className="w-6 h-6 text-success mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Perdidos</p>
            <p className="text-lg font-bold">{weightLoss.toFixed(1)}kg</p>
          </div>
          <div className="text-center">
            <Target className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Restantes</p>
            <p className="text-lg font-bold">{Math.max(0, totalGoal - weightLoss).toFixed(1)}kg</p>
          </div>
          <div className="text-center">
            <Trophy className="w-6 h-6 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">IMC Atual</p>
            <p className="text-lg font-bold">{(currentWeight / Math.pow(profile.height / 100, 2)).toFixed(1)}</p>
          </div>
        </div>
      </Card>

      {/* Goals */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Seus Objetivos</h3>
        <div className="space-y-2">
          {profile.goals.map((goal, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Target className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm">{goal}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Today's Plan */}
      <Card className="p-6 border-2 border-accent/30 bg-gradient-to-b from-card to-accent/5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Hoje</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${hasWorkoutToday ? "bg-success" : "bg-primary"}`}
              >
                {hasWorkoutToday ? (
                  <CheckCircle2 className="w-6 h-6 text-success-foreground" />
                ) : (
                  <Flame className="w-6 h-6 text-primary-foreground" />
                )}
              </div>
              <div>
                <p className="font-semibold">{todayWorkout}</p>
                <p className="text-sm text-muted-foreground">
                  {todayWorkout === "Descanso" ? "Dia de recuperação" : "Musculação"}
                </p>
              </div>
            </div>
            {hasWorkoutToday && <span className="text-sm font-medium text-success">Completo ✓</span>}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${hasRunToday ? "bg-success" : "bg-accent"}`}
              >
                {hasRunToday ? (
                  <CheckCircle2 className="w-6 h-6 text-success-foreground" />
                ) : (
                  <Activity className="w-6 h-6 text-accent-foreground" />
                )}
              </div>
              <div>
                <p className="font-semibold">Corrida</p>
                <p className="text-sm text-muted-foreground">Cardio diário</p>
              </div>
            </div>
            {hasRunToday && <span className="text-sm font-medium text-success">Completo ✓</span>}
          </div>
        </div>
      </Card>

      {/* Motivation Quote */}
      <Card className="p-6 bg-gradient-to-r from-secondary via-secondary/90 to-primary/80 text-secondary-foreground border-2 border-secondary">
        <p className="text-lg font-medium text-center text-balance italic">
          {userId === "pamela"
            ? '"Você é mais forte do que pensa. Cada treino te aproxima da melhor versão de você! 💪"'
            : '"O corpo alcança o que a mente acredita. Você já começou, continue forte! 💪"'}
        </p>
      </Card>
    </div>
  )
}
