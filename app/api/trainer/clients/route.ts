import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trainerId = searchParams.get("trainerId")

    if (!trainerId) {
      return NextResponse.json({ error: "Trainer ID required" }, { status: 400 })
    }

    const clients = await sql`
      SELECT 
        u.user_id,
        u.pin,
        u.name,
        u.age,
        u.gender,
        u.height,
        u.current_weight,
        u.initial_weight,
        u.target_weight,
        u.partner_gym_id,
        u.subscription_status,
        u.subscription_plan_id,
        u.personal_trainer_id,
        u.created_at,
        tc.status as client_status,
        tc.started_at,
        COUNT(DISTINCT wc.id) as total_workouts,
        MAX(wc.created_at) as last_workout_date
      FROM trainer_clients tc
      JOIN users u ON tc.client_user_id = u.user_id
      LEFT JOIN workout_checkins wc ON u.user_id = wc.user_id
      WHERE tc.trainer_id = ${trainerId} AND tc.status = 'active'
      GROUP BY 
        u.user_id, u.pin, u.name, u.age, u.gender, u.height, 
        u.current_weight, u.initial_weight, u.target_weight, u.partner_gym_id,
        u.subscription_status, u.subscription_plan_id, u.personal_trainer_id, u.created_at,
        tc.status, tc.started_at
      ORDER BY tc.started_at DESC
    `

    return NextResponse.json({ clients })
  } catch (error) {
    console.error("Error fetching trainer clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { trainerId, clientUserId } = await request.json()

    await sql`
      INSERT INTO trainer_clients (trainer_id, client_user_id, status)
      VALUES (${trainerId}, ${clientUserId}, 'active')
      ON CONFLICT (trainer_id, client_user_id) 
      DO UPDATE SET status = 'active', started_at = CURRENT_TIMESTAMP
    `

    await sql`
      UPDATE users 
      SET personal_trainer_id = ${trainerId}
      WHERE user_id = ${clientUserId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding client:", error)
    return NextResponse.json({ error: "Failed to add client" }, { status: 500 })
  }
}
