import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID obrigatório" }, { status: 400 })
    }

    const schedule = await sql`
      SELECT id, user_id, day_of_week, workout_name, description, created_at
      FROM weekly_workout_schedule 
      WHERE user_id = ${userId}
      ORDER BY day_of_week ASC
    `

    return NextResponse.json({ success: true, data: schedule })
  } catch (error) {
    console.error("[v0] Error fetching workout schedule:", error)
    return NextResponse.json({ error: "Erro ao buscar cronograma de treinos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, dayOfWeek, workoutName, description } = await request.json()

    if (!userId || dayOfWeek === undefined || !workoutName) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json({ error: "Dia da semana inválido (0-6)" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO weekly_workout_schedule (user_id, day_of_week, workout_name, description)
      VALUES (${userId}, ${dayOfWeek}, ${workoutName}, ${description || null})
      ON CONFLICT (user_id, day_of_week) 
      DO UPDATE SET 
        workout_name = EXCLUDED.workout_name,
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error saving workout schedule:", error)
    return NextResponse.json({ error: "Erro ao salvar cronograma" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 })
    }

    await sql`
      DELETE FROM weekly_workout_schedule 
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting workout schedule:", error)
    return NextResponse.json({ error: "Erro ao deletar cronograma" }, { status: 500 })
  }
}
