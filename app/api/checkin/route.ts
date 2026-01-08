import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, checkinType, workoutName, distance, duration, notes } = body

    const today = new Date().toISOString().split("T")[0]

    const result = await sql`
      INSERT INTO daily_checkins (user_id, checkin_date, checkin_type, workout_name, distance, duration, notes)
      VALUES (${userId}, ${today}, ${checkinType}, ${workoutName}, ${distance}, ${duration}, ${notes})
      ON CONFLICT (user_id, checkin_date, checkin_type) 
      DO UPDATE SET 
        workout_name = EXCLUDED.workout_name,
        distance = EXCLUDED.distance,
        duration = EXCLUDED.duration,
        notes = EXCLUDED.notes,
        created_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error creating checkin:", error)
    return NextResponse.json({ success: false, error: "Failed to create checkin" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = searchParams.get("limit") || "30"
    const type = searchParams.get("type") // workout ou running

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    let checkins
    if (type) {
      checkins = await sql`
        SELECT * FROM daily_checkins 
        WHERE user_id = ${userId} AND checkin_type = ${type}
        ORDER BY checkin_date DESC
        LIMIT ${Number.parseInt(limit)}
      `
    } else {
      checkins = await sql`
        SELECT * FROM daily_checkins 
        WHERE user_id = ${userId}
        ORDER BY checkin_date DESC
        LIMIT ${Number.parseInt(limit)}
      `
    }

    return NextResponse.json({ success: true, data: checkins })
  } catch (error) {
    console.error("[v0] Error fetching checkins:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch checkins" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 })
    }

    await sql`DELETE FROM daily_checkins WHERE id = ${Number.parseInt(id)}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting checkin:", error)
    return NextResponse.json({ success: false, error: "Failed to delete checkin" }, { status: 500 })
  }
}
