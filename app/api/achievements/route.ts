import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  }

  try {
    // Buscar todas as conquistas disponíveis com status de desbloqueio do usuário
    const achievements = await sql`
      SELECT 
        a.*,
        ua.unlocked_at,
        ua.progress,
        CASE WHEN ua.id IS NOT NULL THEN true ELSE false END as unlocked
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.achievement_id = ua.achievement_id AND ua.user_id = ${userId}
      WHERE a.is_active = true
      ORDER BY unlocked DESC, a.points DESC
    `

    return NextResponse.json({ success: true, data: achievements })
  } catch (error) {
    console.error("[v0] Error fetching achievements:", error)
    return NextResponse.json({ error: "Erro ao buscar conquistas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, achievementId } = body

    if (!userId || !achievementId) {
      return NextResponse.json({ error: "userId e achievementId são obrigatórios" }, { status: 400 })
    }

    // Verificar se a conquista já foi desbloqueada
    const existing = await sql`
      SELECT * FROM user_achievements
      WHERE user_id = ${userId} AND achievement_id = ${achievementId}
    `

    if (existing.length > 0) {
      return NextResponse.json({ success: true, data: existing[0], alreadyEarned: true })
    }

    // Buscar informações da conquista
    const achievement = await sql`
      SELECT * FROM achievements WHERE achievement_id = ${achievementId}
    `

    if (achievement.length === 0) {
      return NextResponse.json({ error: "Conquista não encontrada" }, { status: 404 })
    }

    // Desbloquear a conquista
    const result = await sql`
      INSERT INTO user_achievements (user_id, achievement_id, progress)
      VALUES (${userId}, ${achievementId}, 100)
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: { ...result[0], achievement: achievement[0] },
      newAchievement: true,
    })
  } catch (error) {
    console.error("[v0] Error unlocking achievement:", error)
    return NextResponse.json({ error: "Erro ao desbloquear conquista" }, { status: 500 })
  }
}
