import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  try {
    const consents = await sql`
      SELECT * FROM user_consents 
      WHERE user_id = ${userId}
      ORDER BY accepted_at DESC
    `

    return NextResponse.json({ consents })
  } catch (error) {
    console.error("Error fetching consents:", error)
    return NextResponse.json({ error: "Failed to fetch consents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, consentType, version, ipAddress, userAgent } = body

    if (!userId || !consentType || !version) {
      return NextResponse.json({ error: "userId, consentType and version are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO user_consents (user_id, consent_type, version, ip_address, user_agent)
      VALUES (${userId}, ${consentType}, ${version}, ${ipAddress}, ${userAgent})
      RETURNING *
    `

    return NextResponse.json({ consent: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating consent:", error)
    return NextResponse.json({ error: "Failed to create consent" }, { status: 500 })
  }
}
