import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const [user] = await sql`
      SELECT * FROM users WHERE user_id = ${userId}
    `

    const measurements = await sql`
      SELECT * FROM body_measurements 
      WHERE user_id = ${userId}
      ORDER BY measurement_date DESC
      LIMIT 10
    `

    const workouts = await sql`
      SELECT * FROM workouts 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `

    const stats = await sql`
      SELECT 
        COUNT(*) as total_workouts,
        COUNT(DISTINCT DATE(created_at)) as workout_days
      FROM workouts 
      WHERE user_id = ${userId}
        AND created_at >= NOW() - INTERVAL '30 days'
    `

    return NextResponse.json({
      user,
      measurements,
      workouts,
      stats: stats[0],
    })
  } catch (error) {
    console.error("Error fetching client progress:", error)
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}
