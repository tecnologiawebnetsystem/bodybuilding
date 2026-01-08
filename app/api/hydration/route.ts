import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  }

  try {
    const hydration = await sql`
      SELECT * FROM daily_hydration
      WHERE user_id = ${userId} AND hydration_date = ${date}
    `

    if (hydration.length === 0) {
      return NextResponse.json({ success: true, data: { water_intake_ml: 0, goal_ml: 3000 } })
    }

    return NextResponse.json({ success: true, data: hydration[0] })
  } catch (error) {
    console.error("[v0] Error fetching hydration:", error)
    return NextResponse.json({ error: "Erro ao buscar hidratação" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, date, waterIntakeMl, goalMl } = body

    if (!userId || !date) {
      return NextResponse.json({ error: "userId e date são obrigatórios" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO daily_hydration (user_id, hydration_date, water_intake_ml, goal_ml, updated_at)
      VALUES (${userId}, ${date}, ${waterIntakeMl}, ${goalMl || 3000}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, hydration_date)
      DO UPDATE SET 
        water_intake_ml = ${waterIntakeMl},
        goal_ml = ${goalMl || 3000},
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error saving hydration:", error)
    return NextResponse.json({ error: "Erro ao salvar hidratação" }, { status: 500 })
  }
}
