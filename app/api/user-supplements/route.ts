import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  try {
    const supplements = await sql`
      SELECT * FROM user_supplements 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `

    return NextResponse.json({ 
      success: true, 
      data: supplements.length > 0 ? supplements[0] : null 
    })
  } catch (error) {
    console.error("Error fetching supplements:", error)
    return NextResponse.json({ error: "Failed to fetch supplements" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, supplements, dailySchedule } = body

    if (!userId || !supplements) {
      return NextResponse.json({ error: "userId and supplements required" }, { status: 400 })
    }

    // Desativar suplementos anteriores
    await sql`
      UPDATE user_supplements 
      SET is_active = false 
      WHERE user_id = ${userId}
    `

    // Inserir novos suplementos
    const result = await sql`
      INSERT INTO user_supplements (user_id, supplements, daily_schedule, is_active)
      VALUES (${userId}, ${JSON.stringify(supplements)}, ${JSON.stringify(dailySchedule || [])}, true)
      RETURNING id
    `

    return NextResponse.json({ 
      success: true, 
      id: result[0]?.id 
    })
  } catch (error) {
    console.error("Error saving supplements:", error)
    return NextResponse.json({ error: "Failed to save supplements" }, { status: 500 })
  }
}
