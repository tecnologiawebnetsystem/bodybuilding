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
    const challenges = await sql`
      SELECT urc.*, rc.name, rc.challenge_type, rc.target_value
      FROM user_running_challenges urc
      JOIN running_challenges rc ON urc.challenge_id = rc.id
      WHERE urc.user_id = ${userId}
    `
    return NextResponse.json({ success: true, data: challenges })
  } catch (error) {
    console.error("Error fetching user challenges:", error)
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, challengeId } = body

    if (!userId || !challengeId) {
      return NextResponse.json({ success: false, error: "userId and challengeId are required" }, { status: 400 })
    }

    // Verificar se ja esta participando
    const existing = await sql`
      SELECT id FROM user_running_challenges 
      WHERE user_id = ${userId} AND challenge_id = ${challengeId}
    `

    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: "Already joined" })
    }

    const result = await sql`
      INSERT INTO user_running_challenges (user_id, challenge_id, current_progress)
      VALUES (${userId}, ${challengeId}, 0)
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Error joining challenge:", error)
    return NextResponse.json({ success: false, error: "Failed to join challenge" }, { status: 500 })
  }
}
