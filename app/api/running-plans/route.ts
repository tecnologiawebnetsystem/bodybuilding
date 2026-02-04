import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const plans = await sql`
      SELECT * FROM running_plans 
      WHERE is_default = true
      ORDER BY difficulty, duration_weeks
    `
    return NextResponse.json({ success: true, data: plans })
  } catch (error) {
    console.error("Error fetching running plans:", error)
    return NextResponse.json({ success: true, data: [] })
  }
}
