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
    // Buscar ultimos 7 dias
    const data = await sql`
      SELECT date, water_intake_ml, goal_ml 
      FROM hydration
      WHERE user_id = ${userId}
      AND date >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY date ASC
    `
    
    // Preencher dias faltantes
    const result = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      
      const existing = data.find((d: any) => d.date === dateStr || new Date(d.date).toISOString().split("T")[0] === dateStr)
      result.push({
        date: dateStr,
        water_intake_ml: existing?.water_intake_ml || 0,
        goal_ml: existing?.goal_ml || 3000,
      })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error fetching weekly hydration:", error)
    return NextResponse.json({ success: false, data: [] })
  }
}
