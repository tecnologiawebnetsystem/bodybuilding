import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") || "following" // following, followers

    let connections

    if (type === "following") {
      connections = await sql`
        SELECT u.user_id, u.name, u.weight, u.height, uc.created_at
        FROM user_connections uc
        JOIN users u ON uc.following_id = u.user_id
        WHERE uc.follower_id = ${userId}
        ORDER BY uc.created_at DESC
      `
    } else {
      connections = await sql`
        SELECT u.user_id, u.name, u.weight, u.height, uc.created_at
        FROM user_connections uc
        JOIN users u ON uc.follower_id = u.user_id
        WHERE uc.following_id = ${userId}
        ORDER BY uc.created_at DESC
      `
    }

    return NextResponse.json(connections)
  } catch (error) {
    console.error("Error fetching connections:", error)
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json()

    // Toggle follow
    const existing = await sql`
      SELECT id FROM user_connections 
      WHERE follower_id = ${followerId} AND following_id = ${followingId}
    `

    if (existing.length > 0) {
      // Unfollow
      await sql`
        DELETE FROM user_connections 
        WHERE follower_id = ${followerId} AND following_id = ${followingId}
      `
      return NextResponse.json({ following: false })
    } else {
      // Follow
      await sql`
        INSERT INTO user_connections (follower_id, following_id)
        VALUES (${followerId}, ${followingId})
      `
      return NextResponse.json({ following: true })
    }
  } catch (error) {
    console.error("Error toggling follow:", error)
    return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 })
  }
}
