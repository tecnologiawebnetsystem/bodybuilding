"use client"

import { Badge } from "@/components/ui/badge"
import { Building2, Trophy, Zap } from "lucide-react"

interface GymBadgeProps {
  gym: {
    gymName: string
    badgeColor: string
    memberSince?: string
    totalPoints?: number
    streak?: number
    city?: string
    state?: string
  }
  size?: "sm" | "md" | "lg"
}

export function GymBadge({ gym, size = "md" }: GymBadgeProps) {
  const isSmall = size === "sm"
  const isLarge = size === "lg"

  return (
    <div
      className={`relative rounded-xl border-2 ${isLarge ? "p-6" : isSmall ? "p-3" : "p-4"}`}
      style={{ borderColor: gym.badgeColor }}
    >
      {/* Badge header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`${isLarge ? "p-2" : "p-1.5"} rounded-lg`} style={{ backgroundColor: `${gym.badgeColor}20` }}>
          <Building2 className={isLarge ? "w-5 h-5" : "w-4 h-4"} style={{ color: gym.badgeColor }} />
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${isLarge ? "text-lg" : isSmall ? "text-sm" : "text-base"}`}>{gym.gymName}</p>
          {gym.memberSince && (
            <p className="text-xs text-muted-foreground">
              Membro desde {new Date(gym.memberSince).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
            </p>
          )}
        </div>
        <Badge
          variant="secondary"
          className={isSmall ? "text-xs px-2" : ""}
          style={{
            backgroundColor: `${gym.badgeColor}15`,
            color: gym.badgeColor,
            borderColor: gym.badgeColor,
          }}
        >
          Verificado
        </Badge>
      </div>

      {/* Stats */}
      {(gym.totalPoints !== undefined || gym.streak !== undefined) && (
        <div className="flex gap-3 mt-3 pt-3 border-t">
          {gym.totalPoints !== undefined && (
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-xs text-muted-foreground">Pontos</p>
                <p className="font-semibold">{gym.totalPoints}</p>
              </div>
            </div>
          )}
          {gym.streak !== undefined && (
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Sequência</p>
                <p className="font-semibold">{gym.streak} dias</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
