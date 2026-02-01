"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Trophy, Flame, Activity, Target, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface StatsTabProps {
  userId: string
  preferences: UserPreferences
}

export function StatsTab({ userId, preferences }: StatsTabProps) {
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
      // Erro silencioso para nao impactar UX
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
    } catch {
      // Erro silencioso
    }
  }

  const deleteRecord = async (id: number, type: "workout" | "running") => {
    try {
      const endpoint = type === "workout" ? "/api/checkin" : "/api/running"
      const res = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" })
      const result = await res.json()

      if (result.success) {
        await loadData()
        if (detailsModal.type === "workouts" || detailsModal.type === "runs") {
          await openDetails(detailsModal.type)
        }
      }
    } catch {
      // Erro silencioso
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
      <h2 className="text-2xl font-bold text-white">Estatísticas</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          className="p-4 text-center border-2 cursor-pointer hover:opacity-80 transition-opacity bg-white/5"
          style={{ borderColor: preferences.theme_primary + "30" }}
          onClick={() => openDetails("streak")}
        >
          <Flame className="w-8 h-8 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
          <p className="text-3xl font-bold text-white">{stats?.currentStreak || 0}</p>
          <p className="text-sm text-gray-300">Dias Seguidos</p>
        </Card>

        <Card
          className="p-4 text-center border-2 cursor-pointer hover:opacity-80 transition-opacity bg-white/5"
          style={{ borderColor: preferences.theme_secondary + "30" }}
          onClick={() => openDetails("workouts")}
        >
          <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: preferences.theme_secondary }} />
          <p className="text-3xl font-bold text-white">{stats?.totalWorkouts || 0}</p>
          <p className="text-sm text-gray-300">Treinos</p>
        </Card>

        <Card
          className="p-4 text-center border-2 cursor-pointer hover:opacity-80 transition-opacity bg-white/5"
          style={{ borderColor: preferences.theme_accent + "30" }}
          onClick={() => openDetails("runs")}
        >
          <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: preferences.theme_accent }} />
          <p className="text-3xl font-bold text-white">{stats?.totalRuns || 0}</p>
          <p className="text-sm text-gray-300">Corridas</p>
        </Card>

        <Card
          className="p-4 text-center border-2 cursor-pointer hover:opacity-80 transition-opacity bg-white/5"
          style={{ borderColor: preferences.theme_primary + "30" }}
          onClick={() => openDetails("distance")}
        >
          <Target className="w-8 h-8 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
          <p className="text-3xl font-bold text-white">{Number(stats?.totalDistance || 0).toFixed(1)}km</p>
          <p className="text-sm text-gray-300">Distância</p>
        </Card>
      </div>

      <Dialog open={detailsModal.open} onOpenChange={(open) => setDetailsModal({ ...detailsModal, open })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: preferences.theme_primary }}>
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
                <Card
                  key={record.id}
                  className="p-4 border-2"
                  style={{ borderColor: preferences.theme_primary + "20" }}
                >
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
                          <span className="font-semibold" style={{ color: preferences.theme_accent }}>
                            {(Number(record.distance) || 0).toFixed(2)}km
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
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Evolução do Peso</h3>
          <div className="space-y-3">
            {stats.weightProgress.slice(0, 10).map((log: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{new Date(log.log_date).toLocaleDateString("pt-BR")}</span>
                <span className="font-semibold text-white">{log.weight}kg</span>
                {idx < stats.weightProgress.length - 1 && stats.weightProgress[idx + 1]?.weight && (
                  <span
                    className={`text-sm ${Number.parseFloat(log.weight) < Number.parseFloat(stats.weightProgress[idx + 1].weight) ? "text-green-600" : "text-red-600"}`}
                  >
                    {((Number.parseFloat(log.weight) || 0) - (Number.parseFloat(stats.weightProgress[idx + 1].weight) || 0)).toFixed(1)}kg
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
