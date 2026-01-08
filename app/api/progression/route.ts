import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Buscar progressão atual do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const progression = await sql`
      SELECT * FROM workout_progressions 
      WHERE user_id = ${userId} AND active = true
      ORDER BY start_date DESC
      LIMIT 1
    `

    return NextResponse.json({ success: true, data: progression[0] || null })
  } catch (error) {
    console.error("[v0] Error fetching progression:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch progression" }, { status: 500 })
  }
}

// POST - Criar nova progressão (a cada 3 meses)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, startDate, difficultyLevel } = body

    // Desativar progressão anterior
    await sql`
      UPDATE workout_progressions 
      SET active = false 
      WHERE user_id = ${userId} AND active = true
    `

    // Calcular cycle_number
    const cycles = await sql`
      SELECT COUNT(*) as count FROM workout_progressions 
      WHERE user_id = ${userId}
    `
    const cycleNumber = Number(cycles[0].count) + 1

    // Calcular end_date (3 meses após start_date)
    const start = new Date(startDate)
    const end = new Date(start)
    end.setMonth(end.getMonth() + 3)

    const result = await sql`
      INSERT INTO workout_progressions (user_id, cycle_number, start_date, end_date, difficulty_level, active)
      VALUES (${userId}, ${cycleNumber}, ${startDate}, ${end.toISOString().split("T")[0]}, ${difficultyLevel}, true)
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error creating progression:", error)
    return NextResponse.json({ success: false, error: "Failed to create progression" }, { status: 500 })
  }
}
