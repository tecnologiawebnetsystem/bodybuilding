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
    const goals = await sql`
      SELECT * FROM measurement_goals 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY created_at DESC
    `
    return NextResponse.json({ success: true, data: goals })
  } catch (error) {
    console.error("Error fetching measurement goals:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, measurementType, targetValue, targetDate, startValue } = body

    if (!userId || !measurementType || !targetValue) {
      return NextResponse.json({ success: false, error: "userId, measurementType and targetValue are required" }, { status: 400 })
    }

    // Desativar metas anteriores do mesmo tipo
    await sql`
      UPDATE measurement_goals 
      SET is_active = false 
      WHERE user_id = ${userId} AND measurement_type = ${measurementType} AND is_active = true
    `

    const result = await sql`
      INSERT INTO measurement_goals (user_id, measurement_type, target_value, target_date, start_value, is_active)
      VALUES (${userId}, ${measurementType}, ${targetValue}, ${targetDate || null}, ${startValue || null}, true)
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Error saving measurement goal:", error)
    return NextResponse.json({ success: false, error: "Failed to save goal" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, achieved } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 })
    }

    if (achieved) {
      await sql`
        UPDATE measurement_goals 
        SET achieved_at = NOW(), is_active = false
        WHERE id = ${id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating measurement goal:", error)
    return NextResponse.json({ success: false, error: "Failed to update goal" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ success: false, error: "id is required" }, { status: 400 })
  }

  try {
    await sql`DELETE FROM measurement_goals WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting measurement goal:", error)
    return NextResponse.json({ success: false, error: "Failed to delete goal" }, { status: 500 })
  }
}
