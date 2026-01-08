"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Trophy, Flame, Activity, Target, Award, Trash2 } from "lucide-react"
import { userProfiles } from "@/lib/user-profiles"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface StatsTabProps {
  userId: string
}

export function StatsTab({ userId }: StatsTabProps) {
  const profile = userProfiles[userId]
  const [stats, setStats] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [detailsModal, setDetailsModal] = useState<{
    open: boolean
    type: "workouts" | "runs" | "streak" | "distance" | null
    data: any[]
  }>({ open: false, type: null, data: [] })

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      const [statsRes, achievementsRes] = await Promise.all([
        fetch(`/api/stats?userId=${userId}`),
        fetch(`/api/achievements?userId=${userId}`),
      ])

      const statsData = await statsRes.json()
      const achievementsData = await achievementsRes.json()

      if (statsData.success) setStats(statsData.data)
      if (achievementsData.success) setAchievements(achievementsData.data)

      if (statsData.success) {
        checkAchievements(statsData.data)
      }
    } catch (error) {
      console.error("[v0] Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const openDetails = async (type: "workouts" | "runs" | "streak" | "distance") => {
    try {
      let data = []

      if (type === "workouts") {
        const res = await fetch(`/api/checkin?userId=${userId}&type=workout`)
        const result = await res.json()
        data = result.success ? result.data : []
      } else if (type === "runs") {
        const res = await fetch(`/api/running?userId=${userId}`)
        const result = await res.json()
        data = result.success ? result.data : []
      } else if (type === "streak" || type === "distance") {
        const res = await fetch(`/api/checkin?userId=${userId}`)
        const result = await res.json()
        data = result.success ? result.data : []
      }

      setDetailsModal({ open: true, type, data })
    } catch (error) {
      console.error("[v0] Error loading details:", error)
    }
  }

  const deleteRecord = async (id: number, type: "workout" | "running") => {
    try {
      const endpoint = type === "workout" ? "/api/checkin" : "/api/running"
      const res = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" })
      const result = await res.json()

      if (result.success) {
        // Recarregar dados
        await loadData()
        // Atualizar modal
        if (detailsModal.type === "workouts" || detailsModal.type === "runs") {
          await openDetails(detailsModal.type)
        }
      }
    } catch (error) {
      console.error("[v0] Error deleting record:", error)
    }
  }

  const checkAchievements = async (currentStats: any) => {
    const achievementsToCheck = [
      {
        type: "first_workout",
        name: "Primeira Vez",
        desc: "Completou o primeiro treino",
        condition: currentStats.totalWorkouts >= 1,
        icon: "🎯",
      },
      {
        type: "week_streak",
        name: "7 Dias Seguidos",
        desc: "Treinou 7 dias consecutivos",
        condition: currentStats.currentStreak >= 7,
        icon: "🔥",
      },
      {
        type: "month_streak",
        name: "30 Dias",
        desc: "30 dias de consistência",
        condition: currentStats.currentStreak >= 30,
        icon: "💪",
      },
      {
        type: "fifty_workouts",
        name: "50 Treinos",
        desc: "Completou 50 treinos",
        condition: currentStats.totalWorkouts >= 50,
        icon: "⭐",
      },
      {
        type: "hundred_km",
        name: "100km Rodados",
        desc: "Correu 100km no total",
        condition: currentStats.totalDistance >= 100,
        icon: "🏃",
      },
    ]

    for (const achievement of achievementsToCheck) {
      if (achievement.condition) {
        await fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            achievementType: achievement.type,
            achievementName: achievement.name,
            achievementDescription: achievement.desc,
            icon: achievement.icon,
          }),
        })
      }
    }
  }

  if (loading) {
    return <p className="text-center py-8">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estatísticas e Conquistas</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          className="p-4 text-center border-2 cursor-pointer hover:opacity-80 transition-opacity"
          style={{ borderColor: profile.theme.primary + "30" }}
          onClick={() => openDetails("streak")}
        >
          <Flame className="w-8 h-8 mx-auto mb-2" style={{ color: profile.theme.primary }} />
          <p className="text-3xl font-bold">{stats?.currentStreak || 0}</p>
          <p className="text-sm text-muted-foreground">Dias Seguidos</p>
        </Card>

        <Card
          className="p-4 text-center border-2 cursor-pointer hover:opacity-80 transition-opacity"
          style={{ borderColor: profile.theme.secondary + "30" }}
          onClick={() => openDetails("workouts")}
        >
          <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: profile.theme.secondary }} />
          <p className="text-3xl font-bold">{stats?.totalWorkouts || 0}</p>
          <p className="text-sm text-muted-foreground">Treinos</p>
        </Card>

        <Card
          className="p-4 text-center border-2 cursor-pointer hover:opacity-80 transition-opacity"
          style={{ borderColor: profile.theme.accent + "30" }}
          onClick={() => openDetails("runs")}
        >
          <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: profile.theme.accent }} />
          <p className="text-3xl font-bold">{stats?.totalRuns || 0}</p>
          <p className="text-sm text-muted-foreground">Corridas</p>
        </Card>

        <Card
          className="p-4 text-center border-2 cursor-pointer hover:opacity-80 transition-opacity"
          style={{ borderColor: profile.theme.success + "30" }}
          onClick={() => openDetails("distance")}
        >
          <Target className="w-8 h-8 mx-auto mb-2" style={{ color: profile.theme.success }} />
          <p className="text-3xl font-bold">{Number(stats?.totalDistance || 0).toFixed(1)}km</p>
          <p className="text-sm text-muted-foreground">Distância</p>
        </Card>
      </div>

      <Dialog open={detailsModal.open} onOpenChange={(open) => setDetailsModal({ ...detailsModal, open })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: profile.theme.primary }}>
              {detailsModal.type === "workouts" && "Detalhes dos Treinos"}
              {detailsModal.type === "runs" && "Detalhes das Corridas"}
              {detailsModal.type === "streak" && "Histórico de Check-ins"}
              {detailsModal.type === "distance" && "Histórico de Distância"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {detailsModal.data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum registro encontrado</p>
            ) : (
              detailsModal.data.map((record: any) => (
                <Card key={record.id} className="p-4 border-2" style={{ borderColor: profile.theme.primary + "20" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{record.workout_name || record.checkin_type || "Corrida"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.checkin_date || record.date).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      {record.distance && (
                        <p className="text-sm mt-1">
                          <span className="font-semibold" style={{ color: profile.theme.accent }}>
                            {Number(record.distance).toFixed(2)}km
                          </span>
                          {record.duration && ` • ${record.duration} min`}
                        </p>
                      )}
                      {record.notes && <p className="text-sm text-muted-foreground italic mt-1">{record.notes}</p>}
                    </div>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir este registro?")) {
                          deleteRecord(record.id, detailsModal.type === "workouts" ? "workout" : "running")
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {stats?.weightProgress && stats.weightProgress.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Evolução do Peso</h3>
          <div className="space-y-3">
            {stats.weightProgress.slice(0, 10).map((log: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(log.log_date).toLocaleDateString("pt-BR")}
                </span>
                <span className="font-semibold">{log.weight}kg</span>
                {idx < stats.weightProgress.length - 1 && (
                  <span
                    className={`text-sm ${Number.parseFloat(log.weight) < Number.parseFloat(stats.weightProgress[idx + 1].weight) ? "text-success" : "text-destructive"}`}
                  >
                    {(Number.parseFloat(log.weight) - Number.parseFloat(stats.weightProgress[idx + 1].weight)).toFixed(
                      1,
                    )}
                    kg
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6" style={{ color: profile.theme.primary }} />
          <h3 className="text-lg font-bold">Conquistas</h3>
        </div>
        {achievements.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Continue treinando para desbloquear conquistas!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="p-4 text-center border-2"
                style={{ borderColor: profile.theme.success + "30" }}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="font-bold text-sm mb-1">{achievement.achievement_name}</p>
                <p className="text-xs text-muted-foreground">{achievement.achievement_description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(achievement.earned_date).toLocaleDateString("pt-BR")}
                </p>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6" style={{ backgroundColor: profile.theme.primary + "10" }}>
        <h3 className="font-bold mb-2">Próximas Conquistas</h3>
        <div className="space-y-2 text-sm">
          {stats?.currentStreak < 7 && <p>🔥 {7 - stats.currentStreak} dias para "7 Dias Seguidos"</p>}
          {stats?.totalWorkouts < 50 && <p>💪 {50 - stats.totalWorkouts} treinos para "50 Treinos"</p>}
          {stats?.totalDistance < 100 && <p>🏃 {(100 - stats.totalDistance).toFixed(1)}km para "100km Rodados"</p>}
        </div>
      </Card>
    </div>
  )
}
