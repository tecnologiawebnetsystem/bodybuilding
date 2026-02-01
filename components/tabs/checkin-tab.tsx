"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, TrendingUp, Calendar, Activity, Dumbbell, AlertCircle, Trash2 } from "lucide-react"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface CheckinTabProps {
  userId: string
  preferences: UserPreferences
}

interface CheckinStats {
  monthly: {
    workout_count: number
    running_count: number
    total_distance: number
    avg_duration: number
  }
  lastWeek: Array<{
    id: number
    checkin_date: string
    checkin_type: string
    workout_name: string
    distance: number
  }>
}

export function CheckinTab({ userId, preferences }: CheckinTabProps) {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<CheckinStats | null>(null)
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false)
  const [lastWorkout, setLastWorkout] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "success" as "success" | "warning" })
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [checkinToDelete, setCheckinToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [userId])

  const loadInitialData = async () => {
    try {
      // Carregar stats e último treino em paralelo
      const [statsResponse, lastWorkoutResponse] = await Promise.all([
        fetch(`/api/checkin/stats?userId=${userId}`),
        fetch(`/api/checkin?userId=${userId}&limit=1&type=workout`)
      ])

      const [statsResult, lastWorkoutResult] = await Promise.all([
        statsResponse.json(),
        lastWorkoutResponse.json()
      ])

      if (statsResult.success) {
        setStats(statsResult.data)
      }
      if (lastWorkoutResult.success && lastWorkoutResult.data.length > 0) {
        setLastWorkout(lastWorkoutResult.data[0].workout_name)
      }
    } catch (error) {
      console.error("[v0] Error loading checkin data:", error)
    }
  }

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

  const confirmDelete = (checkinId: number) => {
    console.log("[v0] confirmDelete called with ID:", checkinId)
    setCheckinToDelete(checkinId)
    console.log("[v0] State will be set to:", checkinId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteCheckin = async () => {
    console.log("[v0] handleDeleteCheckin called, checkinToDelete state:", checkinToDelete)

    if (!checkinToDelete) {
      console.log("[v0] No checkin to delete, returning")
      return
    }

    console.log("[v0] Starting delete process for ID:", checkinToDelete)
    setLoading(true)

    try {
      const url = `/api/checkin?id=${checkinToDelete}`
      console.log("[v0] Calling DELETE endpoint:", url)

      const response = await fetch(url, {
        method: "DELETE",
      })

      console.log("[v0] Response status:", response.status)
      const result = await response.json()
      console.log("[v0] Delete result:", result)

      if (result.success) {
        console.log("[v0] Delete successful, closing dialog and reloading stats")
        setDeleteConfirmOpen(false)
        setCheckinToDelete(null)

        await loadStats()

        setModalContent({
          title: "Check-in Excluído!",
          message: "O registro foi removido com sucesso.",
          type: "success",
        })
        setModalOpen(true)
      } else {
        console.log("[v0] Delete failed:", result.error)
        setModalContent({
          title: "Erro!",
          message: "Não foi possível excluir o registro.",
          type: "warning",
        })
        setModalOpen(true)
        setDeleteConfirmOpen(false)
        setCheckinToDelete(null)
      }
    } catch (error) {
      console.error("[v0] Error deleting checkin:", error)
      setModalContent({
        title: "Erro!",
        message: "Não foi possível excluir o registro.",
        type: "warning",
      })
      setModalOpen(true)
      setDeleteConfirmOpen(false)
      setCheckinToDelete(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2" style={{ borderColor: preferences.theme_primary }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" style={{ color: preferences.theme_primary }} />
            Check-in de Treino
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            className="w-full h-20 text-lg font-semibold"
            style={{ backgroundColor: preferences.theme_primary }}
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
                  backgroundColor: lastWorkout === workout ? "#94a3b8" : preferences.theme_primary,
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
                <CheckCircle2 className="w-8 h-8" style={{ color: preferences.theme_primary }} />
              ) : (
                <AlertCircle className="w-8 h-8 text-orange-500" />
              )}
              <DialogTitle className="text-2xl">{modalContent.title}</DialogTitle>
            </div>
            <DialogDescription className="text-lg pt-2">{modalContent.message}</DialogDescription>
          </DialogHeader>
          <Button size="lg" onClick={() => setModalOpen(false)} style={{ backgroundColor: preferences.theme_primary }}>
            Entendi!
          </Button>
        </DialogContent>
      </Dialog>

      {stats && (
        <>
          <Card className="border-2" style={{ borderColor: preferences.theme_secondary }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" style={{ color: preferences.theme_secondary }} />
                Estatísticas do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: `${preferences.theme_primary}20` }}
                >
                  <div className="text-3xl font-bold" style={{ color: preferences.theme_primary }}>
                    {stats.monthly.workout_count}
                  </div>
                  <div className="text-sm text-muted-foreground">Treinos</div>
                </div>

                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: `${preferences.theme_accent}20` }}
                >
                  <div className="text-3xl font-bold" style={{ color: preferences.theme_accent }}>
                    {stats.monthly.running_count}
                  </div>
                  <div className="text-sm text-muted-foreground">Corridas</div>
                </div>

                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: `${preferences.theme_primary}20` }}
                >
                  <div className="text-3xl font-bold" style={{ color: preferences.theme_primary }}>
                    {Number(stats.monthly.total_distance || 0).toFixed(1)} km
                  </div>
                  <div className="text-sm text-muted-foreground">Distância Total</div>
                </div>

                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: `${preferences.theme_secondary}20` }}
                >
                  <div className="text-3xl font-bold" style={{ color: preferences.theme_secondary }}>
                    {Number(stats.monthly.avg_duration || 0).toFixed(0)} min
                  </div>
                  <div className="text-sm text-muted-foreground">Tempo Médio</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2" style={{ borderColor: preferences.theme_accent }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6" style={{ color: preferences.theme_accent }} />
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
                      style={{ backgroundColor: `${preferences.theme_primary}10` }}
                    >
                      <div className="flex items-center gap-3">
                        {checkin.checkin_type === "workout" ? (
                          <Dumbbell className="w-5 h-5" style={{ color: preferences.theme_primary }} />
                        ) : (
                          <Activity className="w-5 h-5" style={{ color: preferences.theme_accent }} />
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
                      <div className="flex items-center gap-2">
                        {checkin.distance && (
                          <Badge variant="secondary" style={{ backgroundColor: `${preferences.theme_accent}30` }}>
                            {checkin.distance} km
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => confirmDelete(checkin.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
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

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <DialogTitle className="text-2xl">Confirmar Exclusão</DialogTitle>
            </div>
            <DialogDescription className="text-lg pt-2">
              Tem certeza que deseja excluir este check-in? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                console.log("[v0] Cancel button clicked")
                setDeleteConfirmOpen(false)
                setCheckinToDelete(null)
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-destructive hover:bg-destructive/90"
              onClick={() => {
                console.log("[v0] Excluir button clicked! Current checkinToDelete:", checkinToDelete)
                handleDeleteCheckin()
              }}
              disabled={loading}
            >
              {loading ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
