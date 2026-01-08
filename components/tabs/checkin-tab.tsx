"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, TrendingUp, Calendar, Activity, Dumbbell, AlertCircle } from "lucide-react"
import { userProfiles } from "@/lib/user-profiles"

interface CheckinTabProps {
  userId: string
}

interface CheckinStats {
  monthly: {
    workout_count: number
    running_count: number
    total_distance: number
    avg_duration: number
  }
  lastWeek: Array<{
    checkin_date: string
    checkin_type: string
    workout_name: string
    distance: number
  }>
}

export function CheckinTab({ userId }: CheckinTabProps) {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<CheckinStats | null>(null)
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false)
  const [lastWorkout, setLastWorkout] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "success" as "success" | "warning" })
  const profile = userProfiles[userId]

  useEffect(() => {
    loadStats()
    loadLastWorkout()
  }, [userId])

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/checkin/stats?userId=${userId}`)
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error("[v0] Error loading stats:", error)
    }
  }

  const loadLastWorkout = async () => {
    try {
      const response = await fetch(`/api/checkin?userId=${userId}&limit=1&type=workout`)
      const result = await response.json()
      if (result.success && result.data.length > 0) {
        setLastWorkout(result.data[0].workout_name)
      }
    } catch (error) {
      console.error("[v0] Error loading last workout:", error)
    }
  }

  const openWorkoutSelector = () => {
    setShowWorkoutSelector(true)
  }

  const handleWorkoutCheckin = async (selectedWorkout: string) => {
    if (lastWorkout === selectedWorkout) {
      const workoutOrder = { "Treino A": "B", "Treino B": "C", "Treino C": "A" }
      const correctWorkout = workoutOrder[selectedWorkout as keyof typeof workoutOrder]

      setModalContent({
        title: "Atenção!",
        message: `Você fez ${selectedWorkout} no último treino. A série correta é: Treino ${correctWorkout}`,
        type: "warning",
      })
      setModalOpen(true)
      setShowWorkoutSelector(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          checkinType: "workout",
          workoutName: selectedWorkout,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setLastWorkout(selectedWorkout)
        await loadStats()

        setModalContent({
          title: "Check-in Realizado!",
          message: `${selectedWorkout} registrado com sucesso! Bom Treino! 💪`,
          type: "success",
        })
        setModalOpen(true)
        setShowWorkoutSelector(false)
      }
    } catch (error) {
      console.error("[v0] Error checking in:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2" style={{ borderColor: profile.theme.primary }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" style={{ color: profile.theme.primary }} />
            Check-in de Treino
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            className="w-full h-20 text-lg font-semibold"
            style={{ backgroundColor: profile.theme.primary }}
            onClick={openWorkoutSelector}
            disabled={loading}
          >
            <Dumbbell className="w-8 h-8 mr-2" />
            Fazer Check-in do Treino
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showWorkoutSelector} onOpenChange={setShowWorkoutSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Qual treino você vai fazer?</DialogTitle>
            <DialogDescription>
              {lastWorkout ? `Último treino: ${lastWorkout}` : "Escolha a série do treino"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {["Treino A", "Treino B", "Treino C"].map((workout) => (
              <Button
                key={workout}
                size="lg"
                className="h-16 text-lg"
                style={{
                  backgroundColor: lastWorkout === workout ? "#94a3b8" : profile.theme.primary,
                  opacity: lastWorkout === workout ? 0.6 : 1,
                }}
                onClick={() => handleWorkoutCheckin(workout)}
                disabled={loading}
              >
                {workout}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {modalContent.type === "success" ? (
                <CheckCircle2 className="w-8 h-8" style={{ color: profile.theme.success }} />
              ) : (
                <AlertCircle className="w-8 h-8" style={{ color: profile.theme.warning }} />
              )}
              <DialogTitle className="text-2xl">{modalContent.title}</DialogTitle>
            </div>
            <DialogDescription className="text-lg pt-2">{modalContent.message}</DialogDescription>
          </DialogHeader>
          <Button size="lg" onClick={() => setModalOpen(false)} style={{ backgroundColor: profile.theme.primary }}>
            Entendi!
          </Button>
        </DialogContent>
      </Dialog>

      {stats && (
        <>
          <Card className="border-2" style={{ borderColor: profile.theme.secondary }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" style={{ color: profile.theme.secondary }} />
                Estatísticas do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${profile.theme.primary}20` }}>
                  <div className="text-3xl font-bold" style={{ color: profile.theme.primary }}>
                    {stats.monthly.workout_count}
                  </div>
                  <div className="text-sm text-muted-foreground">Treinos</div>
                </div>

                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${profile.theme.accent}20` }}>
                  <div className="text-3xl font-bold" style={{ color: profile.theme.accent }}>
                    {stats.monthly.running_count}
                  </div>
                  <div className="text-sm text-muted-foreground">Corridas</div>
                </div>

                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${profile.theme.success}20` }}>
                  <div className="text-3xl font-bold" style={{ color: profile.theme.success }}>
                    {Number(stats.monthly.total_distance || 0).toFixed(1)} km
                  </div>
                  <div className="text-sm text-muted-foreground">Distância Total</div>
                </div>

                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${profile.theme.secondary}20` }}>
                  <div className="text-3xl font-bold" style={{ color: profile.theme.secondary }}>
                    {Number(stats.monthly.avg_duration || 0).toFixed(0)} min
                  </div>
                  <div className="text-sm text-muted-foreground">Tempo Médio</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2" style={{ borderColor: profile.theme.accent }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6" style={{ color: profile.theme.accent }} />
                Última Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.lastWeek.length > 0 ? (
                  stats.lastWeek.map((checkin, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: `${profile.theme.primary}10` }}
                    >
                      <div className="flex items-center gap-3">
                        {checkin.checkin_type === "workout" ? (
                          <Dumbbell className="w-5 h-5" style={{ color: profile.theme.primary }} />
                        ) : (
                          <Activity className="w-5 h-5" style={{ color: profile.theme.accent }} />
                        )}
                        <div>
                          <p className="font-medium">
                            {checkin.checkin_type === "workout" ? checkin.workout_name : "Corrida"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(checkin.checkin_date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      {checkin.distance && (
                        <Badge variant="secondary" style={{ backgroundColor: `${profile.theme.accent}30` }}>
                          {checkin.distance} km
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">Nenhuma atividade esta semana</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
