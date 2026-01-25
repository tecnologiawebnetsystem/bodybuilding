import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)

    const plans = await sql`
      SELECT * FROM pricing_plans 
      WHERE is_active = true 
      ORDER BY price_monthly ASC
    `

    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}
