import { type NextRequest, NextResponse } from "next"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    console.log("[v0] Fetching preferences for userId:", userId)

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    let preferences
    try {
      preferences = await sql`
        SELECT * FROM user_preferences WHERE user_id = ${userId}
      `
      console.log("[v0] Preferences query result:", preferences)
    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
      // Se a tabela não existe, retornar preferências padrão
      return NextResponse.json({
        user_id: userId,
        theme_primary: "#3b82f6",
        theme_secondary: "#1e40af",
        theme_accent: "#06b6d4",
        enable_gym_checkin: true,
        enable_gym_workouts: true,
        enable_running: true,
        enable_home_workouts: true,
        enable_nutrition: true,
        enable_supplements: true,
        enable_measurements: true,
        enable_hydration: true,
        enable_stats: true,
      })
    }

    if (preferences.length === 0) {
      console.log("[v0] No preferences found, returning defaults")
      // Retornar preferências padrão se não existir
      return NextResponse.json({
        user_id: userId,
        theme_primary: "#3b82f6",
        theme_secondary: "#1e40af",
        theme_accent: "#06b6d4",
        enable_gym_checkin: true,
        enable_gym_workouts: true,
        enable_running: true,
        enable_home_workouts: true,
        enable_nutrition: true,
        enable_supplements: true,
        enable_measurements: true,
        enable_hydration: true,
        enable_stats: true,
      })
    }

    console.log("[v0] Returning preferences:", preferences[0])
    return NextResponse.json(preferences[0])
  } catch (error) {
    console.error("[v0] Error fetching user preferences:", error)
    return NextResponse.json({ error: "Failed to fetch user preferences" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...preferences } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await sql`
      INSERT INTO user_preferences (
        user_id, 
        theme_primary, theme_secondary, theme_accent,
        enable_gym_checkin, enable_gym_workouts, enable_running, enable_home_workouts,
        enable_nutrition, enable_supplements, enable_measurements, enable_hydration, enable_stats
      ) VALUES (
        ${userId},
        ${preferences.theme_primary}, ${preferences.theme_secondary}, ${preferences.theme_accent},
        ${preferences.enable_gym_checkin}, ${preferences.enable_gym_workouts}, 
        ${preferences.enable_running}, ${preferences.enable_home_workouts},
        ${preferences.enable_nutrition}, ${preferences.enable_supplements},
        ${preferences.enable_measurements}, ${preferences.enable_hydration}, ${preferences.enable_stats}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        theme_primary = EXCLUDED.theme_primary,
        theme_secondary = EXCLUDED.theme_secondary,
        theme_accent = EXCLUDED.theme_accent,
        enable_gym_checkin = EXCLUDED.enable_gym_checkin,
        enable_gym_workouts = EXCLUDED.enable_gym_workouts,
        enable_running = EXCLUDED.enable_running,
        enable_home_workouts = EXCLUDED.enable_home_workouts,
        enable_nutrition = EXCLUDED.enable_nutrition,
        enable_supplements = EXCLUDED.enable_supplements,
        enable_measurements = EXCLUDED.enable_measurements,
        enable_hydration = EXCLUDED.enable_hydration,
        enable_stats = EXCLUDED.enable_stats,
        updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json({ error: "Failed to update user preferences" }, { status: 500 })
  }
}
