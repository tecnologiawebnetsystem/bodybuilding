import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const challenges = await sql`
      SELECT * FROM running_challenges 
      WHERE is_active = true
      AND end_date >= CURRENT_DATE
      ORDER BY start_date
    `
    return NextResponse.json({ success: true, data: challenges })
  } catch (error) {
    console.error("Error fetching running challenges:", error)
    return NextResponse.json({ success: true, data: [] })
  }
}
