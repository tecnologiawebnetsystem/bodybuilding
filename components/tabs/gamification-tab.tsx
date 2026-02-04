"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, Medal, Target, Flame, Crown, Star, Users, Calendar, 
  ChevronRight, Lock, Check, Zap, TrendingUp, Award
} from "lucide-react"

interface Achievement {
  id: number
  code: string
  name: string
  description: string
  icon: string
  category: string
  points: number
  requirement_type: string
  requirement_value: number
  badge_color: string
  is_active: boolean
  unlocked_at?: string
}

interface Challenge {
  id: number
  title: string
  description: string
  challenge_type: string
  metric_type: string
  target_value: number
  start_date: string
  end_date: string
  prize_description: string
  points_reward: number
  participants_count: number
  current_progress?: number
  completed?: boolean
}

interface Ranking {
  user_id: string
  user_name: string
  total_points: number
  total_check_ins: number
  current_streak: number
  rank_position: number
}

interface GamificationTabProps {
  userId: string
}

const ICON_MAP: Record<string, typeof Trophy> = {
  footprints: Trophy,
  sword: Zap,
  crown: Crown,
  fire: Flame,
  trophy: Trophy,
  sunrise: Star,
  moon: Star,
  users: Users,
  medal: Medal,
  "trending-up": TrendingUp
}

const COLOR_MAP: Record<string, string> = {
  green: "from-green-500 to-green-600",
  blue: "from-blue-500 to-blue-600",
  gold: "from-yellow-500 to-amber-600",
  orange: "from-orange-500 to-orange-600",
  purple: "from-purple-500 to-purple-600",
  yellow: "from-yellow-400 to-yellow-500",
  indigo: "from-indigo-500 to-indigo-600",
  pink: "from-pink-500 to-pink-600"
}

export function GamificationTab({ userId }: GamificationTabProps) {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([])
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard] = useState<Ranking[]>([])
  const [userRanking, setUserRanking] = useState<Ranking | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"conquistas" | "desafios" | "ranking">("conquistas")
  const [joiningChallenge, setJoiningChallenge] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      const response = await fetch(`/api/gamification?userId=${userId}&type=all`)
      const data = await response.json()
      
      if (data.success) {
        setAllAchievements(data.data.achievements?.all || [])
        setUnlockedAchievements(data.data.achievements?.unlocked || [])
        setChallenges(data.data.challenges?.active || [])
        setUserChallenges(data.data.challenges?.participating || [])
        setLeaderboard(data.data.rankings?.leaderboard || [])
        setUserRanking(data.data.rankings?.userPosition || null)
      }
    } catch (error) {
      console.error("Erro ao carregar gamificacao:", error)
    } finally {
      setLoading(false)
    }
  }

  const joinChallenge = async (challengeId: number) => {
    setJoiningChallenge(challengeId)
    try {
      const response = await fetch("/api/gamification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join_challenge", userId, challengeId })
      })
      
      const data = await response.json()
      if (data.success) {
        await loadData()
      }
    } catch (error) {
      console.error("Erro ao participar do desafio:", error)
    } finally {
      setJoiningChallenge(null)
    }
  }

  const isUnlocked = (achievementId: number) => {
    return unlockedAchievements.some(a => a.id === achievementId)
  }

  const isParticipating = (challengeId: number) => {
    return userChallenges.some(c => c.id === challengeId)
  }

  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + (a.points || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com Pontos */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gamificacao</h2>
          <p className="text-gray-400">Conquistas, desafios e rankings</p>
        </div>
        <Card className="px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-yellow-400">Total de Pontos</p>
              <p className="text-2xl font-bold text-white">{totalPoints}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 rounded-lg p-1">
        {[
          { id: "conquistas", label: "Conquistas", icon: Trophy },
          { id: "desafios", label: "Desafios", icon: Target },
          { id: "ranking", label: "Ranking", icon: Crown }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            className={`flex-1 ${activeTab === tab.id ? "bg-orange-500/20 text-orange-400" : "text-gray-400"}`}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Conquistas */}
      {activeTab === "conquistas" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              {unlockedAchievements.length} de {allAchievements.length} conquistas desbloqueadas
            </p>
            <Progress 
              value={(unlockedAchievements.length / Math.max(allAchievements.length, 1)) * 100} 
              className="w-32 h-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allAchievements.map(achievement => {
              const unlocked = isUnlocked(achievement.id)
              const IconComponent = ICON_MAP[achievement.icon] || Trophy
              const colorClass = COLOR_MAP[achievement.badge_color] || "from-gray-500 to-gray-600"

              return (
                <Card 
                  key={achievement.id}
                  className={`p-4 transition-all ${
                    unlocked 
                      ? "bg-gradient-to-br " + colorClass.replace("from-", "from-").split(" ")[0] + "/20 border-2 border-" + achievement.badge_color + "-500/50"
                      : "bg-white/5 border-white/10 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      unlocked 
                        ? `bg-gradient-to-br ${colorClass}` 
                        : "bg-gray-700"
                    }`}>
                      {unlocked ? (
                        <IconComponent className="w-7 h-7 text-white" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold ${unlocked ? "text-white" : "text-gray-400"}`}>
                          {achievement.name}
                        </h3>
                        <Badge className={unlocked ? `bg-${achievement.badge_color}-500/30 text-${achievement.badge_color}-400` : "bg-gray-700 text-gray-500"}>
                          +{achievement.points} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                      {unlocked && (
                        <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Desbloqueada
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Desafios */}
      {activeTab === "desafios" && (
        <div className="space-y-6">
          {/* Desafios que o usuario participa */}
          {userChallenges.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Meus Desafios
              </h3>
              <div className="grid gap-4">
                {userChallenges.map(challenge => (
                  <Card key={challenge.id} className="p-4 bg-green-500/10 border-green-500/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white">{challenge.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{challenge.description}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Participando</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Progresso</span>
                        <span className="text-white">{challenge.current_progress || 0} / {challenge.target_value}</span>
                      </div>
                      <Progress value={((challenge.current_progress || 0) / challenge.target_value) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <span className="text-gray-500">
                        Termina em {new Date(challenge.end_date).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="text-yellow-400">+{challenge.points_reward} pts</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Desafios Disponiveis */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Desafios Disponiveis
            </h3>
            {challenges.filter(c => !isParticipating(c.id)).length === 0 ? (
              <Card className="p-8 bg-white/5 border-white/10 text-center">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Nenhum desafio disponivel no momento</p>
                <p className="text-sm text-gray-500">Novos desafios em breve!</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {challenges.filter(c => !isParticipating(c.id)).map(challenge => (
                  <Card key={challenge.id} className="p-4 bg-white/5 border-white/10 hover:border-orange-500/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{challenge.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{challenge.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="text-gray-500 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {challenge.participants_count} participantes
                          </span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Ate {new Date(challenge.end_date).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        {challenge.prize_description && (
                          <p className="text-sm text-yellow-400 mt-2">
                            Premio: {challenge.prize_description}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => joinChallenge(challenge.id)}
                        disabled={joiningChallenge === challenge.id}
                        className="bg-gradient-to-r from-orange-600 to-orange-500"
                      >
                        {joiningChallenge === challenge.id ? "..." : "Participar"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ranking */}
      {activeTab === "ranking" && (
        <div className="space-y-4">
          {/* Posicao do usuario */}
          {userRanking && (
            <Card className="p-4 bg-gradient-to-r from-orange-500/20 to-orange-600/10 border-orange-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
                    {userRanking.rank_position || "?"}
                  </div>
                  <div>
                    <p className="text-white font-bold">Sua Posicao</p>
                    <p className="text-sm text-gray-400">
                      {userRanking.total_points} pontos | {userRanking.total_check_ins} check-ins
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 font-bold flex items-center gap-1">
                    <Flame className="w-5 h-5" />
                    {userRanking.current_streak} dias
                  </p>
                  <p className="text-xs text-gray-500">Sequencia atual</p>
                </div>
              </div>
            </Card>
          )}

          {/* Top 10 */}
          <Card className="p-4 bg-white/5 border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Top 10 do Mes
            </h3>
            
            {leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <Crown className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Nenhum ranking disponivel</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((user, idx) => (
                  <div
                    key={user.user_id}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      user.user_id === userId 
                        ? "bg-orange-500/20 border border-orange-500/30" 
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? "bg-yellow-500 text-black" :
                      idx === 1 ? "bg-gray-300 text-black" :
                      idx === 2 ? "bg-amber-600 text-white" :
                      "bg-gray-700 text-white"
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{user.user_name || "Usuario"}</p>
                      <p className="text-xs text-gray-500">{user.total_check_ins} check-ins</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{user.total_points} pts</p>
                      <p className="text-xs text-orange-400 flex items-center gap-1 justify-end">
                        <Flame className="w-3 h-3" />
                        {user.current_streak} dias
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
