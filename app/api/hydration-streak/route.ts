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
    const streak = await sql`
      SELECT * FROM hydration_streaks WHERE user_id = ${userId}
    `
    return NextResponse.json({ success: true, data: streak[0] || { current_streak: 0, longest_streak: 0, total_days_goal_met: 0 } })
  } catch (error) {
    console.error("Error fetching hydration streak:", error)
    return NextResponse.json({ success: false, data: { current_streak: 0, longest_streak: 0, total_days_goal_met: 0 } })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    const today = new Date().toISOString().split("T")[0]
    
    // Verificar streak atual
    const existing = await sql`
      SELECT * FROM hydration_streaks WHERE user_id = ${userId}
    `

    if (existing.length === 0) {
      // Criar novo registro
      await sql`
        INSERT INTO hydration_streaks (user_id, current_streak, longest_streak, last_goal_met_date, total_days_goal_met)
        VALUES (${userId}, 1, 1, ${today}, 1)
      `
    } else {
      const streak = existing[0]
      const lastDate = streak.last_goal_met_date ? new Date(streak.last_goal_met_date) : null
      const todayDate = new Date(today)
      
      // Se ja registrou hoje, ignorar
      if (lastDate && lastDate.toISOString().split("T")[0] === today) {
        return NextResponse.json({ success: true, data: streak })
      }
      
      let newStreak = 1
      // Se ontem bateu a meta, continua a sequencia
      if (lastDate) {
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          newStreak = (streak.current_streak || 0) + 1
        }
      }
      
      const newLongest = Math.max(newStreak, streak.longest_streak || 0)
      const newTotal = (streak.total_days_goal_met || 0) + 1

      await sql`
        UPDATE hydration_streaks 
        SET current_streak = ${newStreak}, 
            longest_streak = ${newLongest}, 
            last_goal_met_date = ${today},
            total_days_goal_met = ${newTotal},
            updated_at = NOW()
        WHERE user_id = ${userId}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating hydration streak:", error)
    return NextResponse.json({ success: false, error: "Failed to update streak" }, { status: 500 })
  }
}
