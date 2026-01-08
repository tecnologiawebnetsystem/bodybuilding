import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const workouts = await sql`
      SELECT * FROM calisthenics_workouts
      WHERE user_id = ${userId}
      ORDER BY workout_date DESC
      LIMIT 30
    `

    return NextResponse.json({ workouts })
  } catch (error) {
    console.error("[v0] Error fetching calisthenics:", error)
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, workoutType, durationMinutes, exercisesCompleted, difficultyLevel, notes } = body

    if (!userId || !workoutType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO calisthenics_workouts (
        user_id, 
        workout_date, 
        workout_type, 
        duration_minutes,
        exercises_completed,
        difficulty_level,
        notes
      )
      VALUES (
        ${userId},
        CURRENT_DATE,
        ${workoutType},
        ${durationMinutes || 30},
        ${exercisesCompleted || []},
        ${difficultyLevel || "iniciante"},
        ${notes || ""}
      )
      RETURNING *
    `

    return NextResponse.json({ workout: result[0] })
  } catch (error) {
    console.error("[v0] Error saving calisthenics workout:", error)
    return NextResponse.json({ error: "Failed to save workout" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (!id || !userId) {
      return NextResponse.json({ error: "ID and User ID required" }, { status: 400 })
    }

    await sql`
      DELETE FROM calisthenics_workouts
      WHERE id = ${id} AND user_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting calisthenics workout:", error)
    return NextResponse.json({ error: "Failed to delete workout" }, { status: 500 })
  }
}
