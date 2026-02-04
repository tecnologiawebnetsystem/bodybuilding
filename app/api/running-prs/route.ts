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
    const prs = await sql`
      SELECT * FROM running_prs 
      WHERE user_id = ${userId}
      ORDER BY distance_type
    `
    return NextResponse.json({ success: true, data: prs })
  } catch (error) {
    console.error("Error fetching PRs:", error)
    return NextResponse.json({ success: true, data: [] })
  }
}
