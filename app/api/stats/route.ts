import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  }

  try {
    // OTIMIZADO: Todas as queries em paralelo para maxima performance
    const [workouts, running, checkins, weightLogs] = await Promise.all([
      // Total workouts
      sql`
        SELECT COUNT(*) as total FROM daily_checkins
        WHERE user_id = ${userId} AND checkin_type = 'workout'
      `,
      // Total running sessions and distance
      sql`
        SELECT 
          COUNT(*) as total_runs,
          COALESCE(SUM(distance), 0) as total_distance,
          COALESCE(SUM(duration), 0) as total_duration
        FROM daily_checkins
        WHERE user_id = ${userId} AND checkin_type = 'running'
      `,
      // Checkins para calcular streak (limitado a ultimos 60 dias)
      sql`
        SELECT DISTINCT checkin_date
        FROM daily_checkins
        WHERE user_id = ${userId}
        ORDER BY checkin_date DESC
        LIMIT 60
      `,
      // Weight logs (limitado a ultimos 30)
      sql`
        SELECT weight, date as log_date
        FROM weight_logs
        WHERE user_id = ${userId}
        ORDER BY date DESC
        LIMIT 30
      `
    ])

    // Calcular streak no servidor
    let currentStreak = 0
    if (checkins.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < checkins.length; i++) {
        const checkinDate = new Date(checkins[i].checkin_date)
        checkinDate.setHours(0, 0, 0, 0)

        const expectedDate = new Date(today)
        expectedDate.setDate(today.getDate() - i)
        expectedDate.setHours(0, 0, 0, 0)

        if (checkinDate.getTime() === expectedDate.getTime()) {
          currentStreak++
        } else {
          break
        }
      }
    }

    const stats = {
      totalWorkouts: Number.parseInt(workouts[0].total),
      totalRuns: Number.parseInt(running[0].total_runs),
      totalDistance: Number.parseFloat(running[0].total_distance),
      totalDuration: Number.parseInt(running[0].total_duration),
      currentStreak,
      weightProgress: weightLogs,
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}
