import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const plans = await sql`
      SELECT * FROM subscription_plans 
      WHERE is_active = true
      ORDER BY price_monthly ASC
    `

    return Response.json({ plans })
  } catch (error) {
    console.error("[v0] Error fetching plans:", error)
    return Response.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}
