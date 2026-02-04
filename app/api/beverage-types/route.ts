import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const types = await sql`
      SELECT * FROM beverage_types 
      WHERE is_default = true
      ORDER BY name
    `
    return NextResponse.json({ success: true, data: types })
  } catch (error) {
    console.error("Error fetching beverage types:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch beverage types" }, { status: 500 })
  }
}
