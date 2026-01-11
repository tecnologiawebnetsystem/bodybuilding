"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Dumbbell,
  Flame,
  TrendingDown,
  Beef,
  Droplet,
  Heart,
  Sunrise,
  Moon,
  Award,
  Calendar,
  Users,
  CheckCircle,
  Star,
  Sparkles,
  Lock,
} from "lucide-react"

const iconMap: Record<string, any> = {
  Trophy,
  Dumbbell,
  Flame,
  TrendingDown,
  Beef,
  Droplet,
  Heart,
  Sunrise,
  Moon,
  Award,
  Calendar,
  Users,
  CheckCircle,
  Star,
  Sparkles,
}

interface Achievement {
  id: number
  achievement_id: string
  title: string
  description: string
  icon: string
  category: string
  points: number
  requirement_type: string
  requirement_value: number
  unlocked: boolean
  unlocked_at?: string
  progress: number
}

interface AchievementsGridProps {
  userId: string
}

export function AchievementsGrid({ userId }: AchievementsGridProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAchievements()
  }, [userId])

  const loadAchievements = async () => {
    try {
      const response = await fetch(`/api/achievements?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setAchievements(data.data)
      }
    } catch (error) {
      console.error("[v0] Error loading achievements:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: "all", label: "Todas" },
    { value: "training", label: "Treino" },
    { value: "progress", label: "Progresso" },
    { value: "cardio", label: "Cardio" },
    { value: "health", label: "Saúde" },
    { value: "social", label: "Social" },
    { value: "gym", label: "Academia" },
  ]

  const filteredAchievements = filter === "all" ? achievements : achievements.filter((a) => a.category === filter)

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0)

  if (loading) {
    return <div className="text-center py-8">Carregando conquistas...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold">{unlockedCount}</div>
          <div className="text-sm text-muted-foreground">Conquistas</div>
        </Card>
        <Card className="p-4 text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">{totalPoints}</div>
          <div className="text-sm text-muted-foreground">Pontos</div>
        </Card>
        <Card className="p-4 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
          <div className="text-sm text-muted-foreground">Completo</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Badge
            key={cat.value}
            variant={filter === cat.value ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setFilter(cat.value)}
          >
            {cat.label}
          </Badge>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => {
          const Icon = iconMap[achievement.icon] || Trophy
          const isLocked = !achievement.unlocked

          return (
            <Card key={achievement.id} className={`p-4 ${isLocked ? "opacity-60" : ""}`}>
              <div className="flex gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isLocked ? "bg-muted" : "bg-gradient-to-br from-yellow-400 to-orange-500"
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <Icon className="w-8 h-8 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <Badge variant="secondary" className="ml-2">
                      {achievement.points} pts
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>

                  {achievement.unlocked ? (
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Desbloqueada em {new Date(achievement.unlocked_at!).toLocaleDateString("pt-BR")}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progresso</span>
                        <span>
                          {achievement.progress || 0}/{achievement.requirement_value}
                        </span>
                      </div>
                      <Progress value={((achievement.progress || 0) / achievement.requirement_value) * 100} />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
