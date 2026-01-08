import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Estatísticas de checkins
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    // Estatísticas do mês atual
    const stats = await sql`
      SELECT 
        COUNT(CASE WHEN checkin_type = 'workout' THEN 1 END) as workout_count,
        COUNT(CASE WHEN checkin_type = 'running' THEN 1 END) as running_count,
        SUM(CASE WHEN checkin_type = 'running' THEN distance ELSE 0 END) as total_distance,
        AVG(CASE WHEN checkin_type = 'running' THEN duration ELSE NULL END) as avg_duration
      FROM daily_checkins
      WHERE user_id = ${userId}
        AND checkin_date >= DATE_TRUNC('month', CURRENT_DATE)
    `

    // Última semana de atividades
    const lastWeek = await sql`
      SELECT checkin_date, checkin_type, workout_name, distance
      FROM daily_checkins
      WHERE user_id = ${userId}
        AND checkin_date >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY checkin_date DESC
    `

    return NextResponse.json({
      success: true,
      data: {
        monthly: stats[0],
        lastWeek: lastWeek,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching checkin stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
