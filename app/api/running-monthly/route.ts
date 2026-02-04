import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
  }

  try {
    const stats = await sql`
      SELECT 
        COALESCE(SUM(distance), 0) as total_distance,
        COUNT(*) as total_sessions,
        COALESCE(AVG(CASE WHEN distance > 0 THEN duration / distance ELSE NULL END), 0) as avg_pace
      FROM running
      WHERE user_id = ${userId}
      AND date >= DATE_TRUNC('month', CURRENT_DATE)
    `

    return NextResponse.json({ 
      success: true, 
      data: {
        distance: parseFloat(stats[0]?.total_distance) || 0,
        sessions: parseInt(stats[0]?.total_sessions) || 0,
        avgPace: parseFloat(stats[0]?.avg_pace) || 0,
      }
    })
  } catch (error) {
    console.error("Error fetching monthly stats:", error)
    return NextResponse.json({ success: true, data: { distance: 0, sessions: 0, avgPace: 0 } })
  }
}
