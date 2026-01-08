import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  }

  try {
    const achievements = await sql`
      SELECT * FROM user_achievements
      WHERE user_id = ${userId}
      ORDER BY earned_date DESC
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
    const { userId, achievementType, achievementName, achievementDescription, icon } = body

    if (!userId || !achievementType || !achievementName) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    // Check if achievement already exists
    const existing = await sql`
      SELECT * FROM user_achievements
      WHERE user_id = ${userId} AND achievement_type = ${achievementType}
    `

    if (existing.length > 0) {
      return NextResponse.json({ success: true, data: existing[0], alreadyEarned: true })
    }

    const result = await sql`
      INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description, icon)
      VALUES (${userId}, ${achievementType}, ${achievementName}, ${achievementDescription}, ${icon})
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0], newAchievement: true })
  } catch (error) {
    console.error("[v0] Error saving achievement:", error)
    return NextResponse.json({ error: "Erro ao salvar conquista" }, { status: 500 })
  }
}
