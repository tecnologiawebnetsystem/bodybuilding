import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET - Fetch all spinning schedule
export async function GET() {
  try {
    const result = await sql`
      SELECT id, time_slot, day_of_week, instructor
      FROM spinning_schedule
      ORDER BY 
        CASE time_slot
          WHEN '6:00' THEN 1
          WHEN '7:00' THEN 2
          WHEN '17:00' THEN 3
          WHEN '18:15' THEN 4
          WHEN '19:15' THEN 5
          WHEN '20:00' THEN 6
          WHEN '21:00' THEN 7
          ELSE 8
        END,
        day_of_week
    `

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] Error fetching spinning schedule:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch schedule" }, { status: 500 })
  }
}

// POST - Create or update a spinning schedule entry
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { time_slot, day_of_week, instructor } = body

    if (!time_slot || !day_of_week) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // If instructor is null or empty, delete the entry
    if (!instructor || instructor.trim() === "") {
      await sql`
        DELETE FROM spinning_schedule
        WHERE time_slot = ${time_slot} AND day_of_week = ${day_of_week}
      `
      return NextResponse.json({ success: true, message: "Entry deleted" })
    }

    // Upsert the entry
    const result = await sql`
      INSERT INTO spinning_schedule (time_slot, day_of_week, instructor)
      VALUES (${time_slot}, ${day_of_week}, ${instructor.trim().toUpperCase()})
      ON CONFLICT (time_slot, day_of_week) 
      DO UPDATE SET 
        instructor = EXCLUDED.instructor,
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error updating spinning schedule:", error)
    return NextResponse.json({ success: false, error: "Failed to update schedule" }, { status: 500 })
  }
}
