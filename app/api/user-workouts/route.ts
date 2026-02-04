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
    const plans = await sql`
      SELECT * FROM ai_workout_plans 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `

    return NextResponse.json({ 
      success: true, 
      plan: plans.length > 0 ? plans[0] : null 
    })
  } catch (error) {
    console.error("Error fetching workout plan:", error)
    return NextResponse.json({ error: "Failed to fetch workout plan" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, plan } = body

    if (!userId || !plan) {
      return NextResponse.json({ error: "userId and plan required" }, { status: 400 })
    }

    // Desativar planos anteriores
    await sql`
      UPDATE ai_workout_plans 
      SET is_active = false 
      WHERE user_id = ${userId}
    `

    // Inserir novo plano
    const result = await sql`
      INSERT INTO ai_workout_plans (user_id, plan_type, plan_data, is_active)
      VALUES (${userId}, ${plan.type}, ${JSON.stringify(plan)}, true)
      RETURNING id
    `

    return NextResponse.json({ 
      success: true, 
      id: result[0]?.id 
    })
  } catch (error) {
    console.error("Error saving workout plan:", error)
    return NextResponse.json({ error: "Failed to save workout plan" }, { status: 500 })
  }
}
