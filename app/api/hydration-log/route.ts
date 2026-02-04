import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const date = searchParams.get("date")

  if (!userId) {
    return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
  }

  try {
    let logs
    if (date) {
      logs = await sql`
        SELECT hl.*, bt.name as beverage_name, bt.icon, bt.color 
        FROM hydration_log hl
        LEFT JOIN beverage_types bt ON hl.beverage_type_id = bt.id
        WHERE hl.user_id = ${userId} 
        AND DATE(hl.logged_at) = ${date}
        ORDER BY hl.logged_at DESC
      `
    } else {
      logs = await sql`
        SELECT hl.*, bt.name as beverage_name, bt.icon, bt.color 
        FROM hydration_log hl
        LEFT JOIN beverage_types bt ON hl.beverage_type_id = bt.id
        WHERE hl.user_id = ${userId}
        ORDER BY hl.logged_at DESC
        LIMIT 50
      `
    }
    return NextResponse.json({ success: true, data: logs })
  } catch (error) {
    console.error("Error fetching hydration log:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch log" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, amountMl, beverageTypeId, effectiveMl } = body

    if (!userId || !amountMl) {
      return NextResponse.json({ success: false, error: "userId and amountMl are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO hydration_log (user_id, amount_ml, beverage_type_id, effective_ml)
      VALUES (${userId}, ${amountMl}, ${beverageTypeId || 1}, ${effectiveMl || amountMl})
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Error saving hydration log:", error)
    return NextResponse.json({ success: false, error: "Failed to save log" }, { status: 500 })
  }
}
