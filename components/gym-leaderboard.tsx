"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, Award } from "lucide-react"

interface LeaderboardEntry {
  user_id: string
  user_name: string
  total_points: number
  checkin_streak: number
  monthly_rank: number
}

interface GymLeaderboardProps {
  gymId: string
  userId: string
}

export function GymLeaderboard({ gymId, userId }: GymLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [gymId, userId])

  const loadLeaderboard = async () => {
    try {
      const response = await fetch(`/api/gym/leaderboard?gymId=${gymId}&userId=${userId}`)
      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
      setUserRank(data.userRank)
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />
    return null
  }

  if (loading) {
    return <div className="text-center py-8">Carregando ranking...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ranking da Academia</h3>
        {userRank && (
          <div className="text-sm text-muted-foreground">
            Sua posição: <span className="font-semibold">#{userRank}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.user_id}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              entry.user_id === userId ? "bg-primary/5 border-primary" : "bg-card"
            }`}
          >
            <div className="flex items-center justify-center w-8">
              {getMedalIcon(index + 1) || <span className="font-semibold text-muted-foreground">#{index + 1}</span>}
            </div>
            <div className="flex-1">
              <p className="font-medium">{entry.user_name}</p>
              <p className="text-sm text-muted-foreground">Sequência: {entry.checkin_streak} dias</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{entry.total_points}</p>
              <p className="text-xs text-muted-foreground">pontos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
