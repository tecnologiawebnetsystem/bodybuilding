import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const settings = await sql`
      SELECT * FROM user_notification_settings
      WHERE user_id = ${userId}
    `

    if (settings.length === 0) {
      // Retornar configurações padrão
      return NextResponse.json({
        water_notifications_enabled: true,
        water_interval_hours: 2,
        water_start_time: "08:00:00",
        water_end_time: "22:00:00",
        workout_notifications_enabled: true,
        gym_time: null,
        running_time: null,
        home_workout_time: null,
        gym_days: [],
        running_days: [],
        home_workout_days: [],
      })
    }

    return NextResponse.json(settings[0])
  } catch (error) {
    console.error("Error fetching notification settings:", error)
    return NextResponse.json({ error: "Failed to fetch notification settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...settings } = body

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    await sql`
      INSERT INTO user_notification_settings (
        user_id,
        water_notifications_enabled,
        water_interval_hours,
        water_start_time,
        water_end_time,
        workout_notifications_enabled,
        gym_time,
        running_time,
        home_workout_time,
        gym_days,
        running_days,
        home_workout_days,
        updated_at
      ) VALUES (
        ${userId},
        ${settings.water_notifications_enabled ?? true},
        ${settings.water_interval_hours ?? 2},
        ${settings.water_start_time ?? "08:00:00"},
        ${settings.water_end_time ?? "22:00:00"},
        ${settings.workout_notifications_enabled ?? true},
        ${settings.gym_time},
        ${settings.running_time},
        ${settings.home_workout_time},
        ${settings.gym_days ?? []},
        ${settings.running_days ?? []},
        ${settings.home_workout_days ?? []},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id) DO UPDATE SET
        water_notifications_enabled = EXCLUDED.water_notifications_enabled,
        water_interval_hours = EXCLUDED.water_interval_hours,
        water_start_time = EXCLUDED.water_start_time,
        water_end_time = EXCLUDED.water_end_time,
        workout_notifications_enabled = EXCLUDED.workout_notifications_enabled,
        gym_time = EXCLUDED.gym_time,
        running_time = EXCLUDED.running_time,
        home_workout_time = EXCLUDED.home_workout_time,
        gym_days = EXCLUDED.gym_days,
        running_days = EXCLUDED.running_days,
        home_workout_days = EXCLUDED.home_workout_days,
        updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving notification settings:", error)
    return NextResponse.json({ error: "Failed to save notification settings" }, { status: 500 })
  }
}
