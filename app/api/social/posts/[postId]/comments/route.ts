import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const postId = Number.parseInt(params.postId)

    const comments = await sql`
      SELECT 
        pc.*,
        u.name as user_name
      FROM post_comments pc
      JOIN users u ON pc.user_id = u.user_id
      WHERE pc.post_id = ${postId}
      ORDER BY pc.created_at DESC
    `

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { userId, comment } = await request.json()
    const postId = Number.parseInt(params.postId)

    const result = await sql`
      INSERT INTO post_comments (post_id, user_id, comment)
      VALUES (${postId}, ${userId}, ${comment})
      RETURNING *
    `

    await sql`UPDATE social_posts SET comments_count = comments_count + 1 WHERE id = ${postId}`

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
