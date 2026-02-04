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
    const plan = await sql`
      SELECT urp.*, rp.name as plan_name, rp.duration_weeks, rp.goal_type, rp.plan_data
      FROM user_running_plans urp
      JOIN running_plans rp ON urp.plan_id = rp.id
      WHERE urp.user_id = ${userId} AND urp.is_active = true
      LIMIT 1
    `
    return NextResponse.json({ success: true, data: plan[0] || null })
  } catch (error) {
    console.error("Error fetching user running plan:", error)
    return NextResponse.json({ success: true, data: null })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, planId } = body

    if (!userId || !planId) {
      return NextResponse.json({ success: false, error: "userId and planId are required" }, { status: 400 })
    }

    // Desativar planos anteriores
    await sql`
      UPDATE user_running_plans SET is_active = false WHERE user_id = ${userId}
    `

    // Criar novo plano
    const result = await sql`
      INSERT INTO user_running_plans (user_id, plan_id, is_active)
      VALUES (${userId}, ${planId}, true)
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Error starting running plan:", error)
    return NextResponse.json({ success: false, error: "Failed to start plan" }, { status: 500 })
  }
}
