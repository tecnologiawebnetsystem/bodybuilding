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
    const settings = await sql`
      SELECT * FROM hydration_settings WHERE user_id = ${userId}
    `
    return NextResponse.json({ 
      success: true, 
      data: settings[0] || { 
        daily_goal_ml: 3000, 
        ml_per_kg: 35, 
        use_weight_calculation: false,
        reminder_enabled: false,
        reminder_interval_hours: 2
      } 
    })
  } catch (error) {
    console.error("Error fetching hydration settings:", error)
    return NextResponse.json({ 
      success: true, 
      data: { 
        daily_goal_ml: 3000, 
        ml_per_kg: 35, 
        use_weight_calculation: false,
        reminder_enabled: false,
        reminder_interval_hours: 2
      } 
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, dailyGoalMl, mlPerKg, useWeightCalculation, reminderEnabled, reminderIntervalHours } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // Upsert settings
    await sql`
      INSERT INTO hydration_settings (user_id, daily_goal_ml, ml_per_kg, use_weight_calculation, reminder_enabled, reminder_interval_hours)
      VALUES (${userId}, ${dailyGoalMl || 3000}, ${mlPerKg || 35}, ${useWeightCalculation || false}, ${reminderEnabled || false}, ${reminderIntervalHours || 2})
      ON CONFLICT (user_id) DO UPDATE SET
        daily_goal_ml = ${dailyGoalMl || 3000},
        ml_per_kg = ${mlPerKg || 35},
        use_weight_calculation = ${useWeightCalculation || false},
        reminder_enabled = ${reminderEnabled || false},
        reminder_interval_hours = ${reminderIntervalHours || 2},
        updated_at = NOW()
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving hydration settings:", error)
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 })
  }
}
