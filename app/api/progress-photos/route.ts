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
    const photos = await sql`
      SELECT * FROM progress_photos 
      WHERE user_id = ${userId} 
      ORDER BY taken_at DESC, created_at DESC
    `
    return NextResponse.json({ success: true, data: photos })
  } catch (error) {
    console.error("Error fetching progress photos:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch photos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, photoUrl, photoType, notes, takenAt, measurementId } = body

    if (!userId || !photoUrl) {
      return NextResponse.json({ success: false, error: "userId and photoUrl are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO progress_photos (user_id, photo_url, photo_type, notes, taken_at, measurement_id)
      VALUES (${userId}, ${photoUrl}, ${photoType || 'front'}, ${notes || null}, ${takenAt || new Date().toISOString().split('T')[0]}, ${measurementId || null})
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Error saving progress photo:", error)
    return NextResponse.json({ success: false, error: "Failed to save photo" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ success: false, error: "id is required" }, { status: 400 })
  }

  try {
    await sql`DELETE FROM progress_photos WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting progress photo:", error)
    return NextResponse.json({ success: false, error: "Failed to delete photo" }, { status: 500 })
  }
}
