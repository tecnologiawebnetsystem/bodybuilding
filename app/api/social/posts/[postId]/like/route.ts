import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { userId } = await request.json()
    const postId = Number.parseInt(params.postId)

    // Toggle like
    const existing = await sql`
      SELECT id FROM post_likes WHERE post_id = ${postId} AND user_id = ${userId}
    `

    if (existing.length > 0) {
      // Unlike
      await sql`DELETE FROM post_likes WHERE post_id = ${postId} AND user_id = ${userId}`
      await sql`UPDATE social_posts SET likes_count = likes_count - 1 WHERE id = ${postId}`
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await sql`INSERT INTO post_likes (post_id, user_id) VALUES (${postId}, ${userId})`
      await sql`UPDATE social_posts SET likes_count = likes_count + 1 WHERE id = ${postId}`
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
