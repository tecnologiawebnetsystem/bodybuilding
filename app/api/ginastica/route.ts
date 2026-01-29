import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      SELECT * FROM ginastica_schedule 
      ORDER BY 
        CASE 
          WHEN time_slot ~ '^[0-9]+:[0-9]+$' 
          THEN CAST(SPLIT_PART(time_slot, ':', 1) AS INTEGER) * 60 + CAST(SPLIT_PART(time_slot, ':', 2) AS INTEGER)
          ELSE 0 
        END
    `
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] Error fetching ginastica schedule:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch schedule" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()
    const { time_slot, day_key, class_name } = body

    // Map day_key to column name
    const validColumns = ["monday", "tuesday", "wednesday", "thursday", "friday"]
    if (!validColumns.includes(day_key)) {
      return NextResponse.json({ success: false, error: "Invalid day" }, { status: 400 })
    }

    // Check if row exists
    const existing = await sql`SELECT id FROM ginastica_schedule WHERE time_slot = ${time_slot}`

    if (existing.length > 0) {
      // Update existing row - use dynamic query based on day
      if (day_key === "monday") {
        await sql`UPDATE ginastica_schedule SET monday = ${class_name}, updated_at = NOW() WHERE time_slot = ${time_slot}`
      } else if (day_key === "tuesday") {
        await sql`UPDATE ginastica_schedule SET tuesday = ${class_name}, updated_at = NOW() WHERE time_slot = ${time_slot}`
      } else if (day_key === "wednesday") {
        await sql`UPDATE ginastica_schedule SET wednesday = ${class_name}, updated_at = NOW() WHERE time_slot = ${time_slot}`
      } else if (day_key === "thursday") {
        await sql`UPDATE ginastica_schedule SET thursday = ${class_name}, updated_at = NOW() WHERE time_slot = ${time_slot}`
      } else if (day_key === "friday") {
        await sql`UPDATE ginastica_schedule SET friday = ${class_name}, updated_at = NOW() WHERE time_slot = ${time_slot}`
      }
    } else {
      // Insert new row
      if (day_key === "monday") {
        await sql`INSERT INTO ginastica_schedule (time_slot, monday) VALUES (${time_slot}, ${class_name})`
      } else if (day_key === "tuesday") {
        await sql`INSERT INTO ginastica_schedule (time_slot, tuesday) VALUES (${time_slot}, ${class_name})`
      } else if (day_key === "wednesday") {
        await sql`INSERT INTO ginastica_schedule (time_slot, wednesday) VALUES (${time_slot}, ${class_name})`
      } else if (day_key === "thursday") {
        await sql`INSERT INTO ginastica_schedule (time_slot, thursday) VALUES (${time_slot}, ${class_name})`
      } else if (day_key === "friday") {
        await sql`INSERT INTO ginastica_schedule (time_slot, friday) VALUES (${time_slot}, ${class_name})`
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating ginastica schedule:", error)
    return NextResponse.json({ success: false, error: "Failed to update schedule" }, { status: 500 })
  }
}
