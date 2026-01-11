import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gymId = searchParams.get("gymId")

  if (!gymId) {
    return NextResponse.json({ error: "gymId is required" }, { status: 400 })
  }

  try {
    // Total de alunos ativos
    const activeUsers = await sql`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE partner_gym_id = ${gymId}
    `

    // Check-ins do mês
    const monthlyCheckins = await sql`
      SELECT COUNT(*) as count
      FROM gym_checkins
      WHERE gym_id = ${gymId}
      AND checkin_date >= DATE_TRUNC('month', CURRENT_DATE)
    `

    // Taxa de retenção (usuários que fizeram check-in nos últimos 30 dias)
    const activeInLast30Days = await sql`
      SELECT COUNT(DISTINCT user_id) as count
      FROM gym_checkins
      WHERE gym_id = ${gymId}
      AND checkin_date >= CURRENT_DATE - INTERVAL '30 days'
    `

    // Top 10 alunos mais engajados
    const topUsers = await sql`
      SELECT 
        u.user_id,
        u.name,
        gl.total_points,
        gl.checkin_streak,
        COUNT(gc.id) as total_checkins
      FROM users u
      JOIN gym_leaderboard gl ON u.user_id = gl.user_id
      LEFT JOIN gym_checkins gc ON u.user_id = gc.user_id
      WHERE u.partner_gym_id = ${gymId}
      GROUP BY u.user_id, u.name, gl.total_points, gl.checkin_streak
      ORDER BY gl.total_points DESC
      LIMIT 10
    `

    // Estatísticas por dia da semana
    const weeklyStats = await sql`
      SELECT 
        TO_CHAR(checkin_date, 'Day') as day_name,
        EXTRACT(DOW FROM checkin_date) as day_num,
        COUNT(*) as checkins
      FROM gym_checkins
      WHERE gym_id = ${gymId}
      AND checkin_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY day_name, day_num
      ORDER BY day_num
    `

    // Crescimento mês a mês
    const growthData = await sql`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as new_users
      FROM users
      WHERE partner_gym_id = ${gymId}
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `

    const totalUsers = Number.parseInt(activeUsers[0].count)
    const retentionRate =
      totalUsers > 0 ? ((Number.parseInt(activeInLast30Days[0].count) / totalUsers) * 100).toFixed(1) : 0

    return NextResponse.json({
      stats: {
        totalUsers,
        monthlyCheckins: Number.parseInt(monthlyCheckins[0].count),
        retentionRate: Number.parseFloat(retentionRate as string),
        activeUsers: Number.parseInt(activeInLast30Days[0].count),
      },
      topUsers,
      weeklyStats,
      growthData,
    })
  } catch (error) {
    console.error("Error fetching gym dashboard:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
