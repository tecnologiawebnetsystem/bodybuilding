import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ success: false, error: "userId required" })
    }

    const bookings = await sql`
      SELECT * FROM class_bookings 
      WHERE user_id = ${userId}
      ORDER BY class_date DESC, class_time ASC
    `

    return NextResponse.json({ success: true, data: bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, classType, classDate, classTime, instructor } = body

    // Verificar se ja tem booking para esta aula
    const existing = await sql`
      SELECT id FROM class_bookings 
      WHERE user_id = ${userId} 
        AND class_type = ${classType}
        AND class_date = ${classDate}
        AND class_time = ${classTime}
    `

    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Voce ja reservou esta aula" })
    }

    const result = await sql`
      INSERT INTO class_bookings (
        user_id, class_type, class_date, class_time, instructor,
        checked_in_app, checked_in_gym, reminder_sent
      ) VALUES (
        ${userId}, ${classType}, ${classDate}, ${classTime}, ${instructor},
        false, false, false
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking" })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, checkedInApp, checkedInGym } = body

    const updates: string[] = []
    const values: any[] = []

    if (checkedInApp !== undefined) {
      updates.push("checked_in_app = $1")
      values.push(checkedInApp)
    }
    if (checkedInGym !== undefined) {
      updates.push(`checked_in_gym = $${values.length + 1}`)
      values.push(checkedInGym)
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update" })
    }

    // Usar query dinamica para updates
    let result
    if (checkedInApp !== undefined && checkedInGym === undefined) {
      result = await sql`
        UPDATE class_bookings 
        SET checked_in_app = ${checkedInApp}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
    } else if (checkedInGym !== undefined && checkedInApp === undefined) {
      result = await sql`
        UPDATE class_bookings 
        SET checked_in_gym = ${checkedInGym}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
    } else {
      result = await sql`
        UPDATE class_bookings 
        SET checked_in_app = ${checkedInApp}, checked_in_gym = ${checkedInGym}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
    }

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to update booking" })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "id required" })
    }

    await sql`DELETE FROM class_bookings WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ success: false, error: "Failed to delete booking" })
  }
}
