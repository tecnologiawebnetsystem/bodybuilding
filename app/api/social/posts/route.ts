import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const feedType = searchParams.get("feedType") || "following" // following, explore, gym

    let posts

    if (feedType === "following" && userId) {
      // Buscar posts de quem o usuário segue
      posts = await sql`
        SELECT 
          sp.*,
          u.user_id, u.name as user_name, u.weight, u.height,
          EXISTS(SELECT 1 FROM post_likes WHERE post_id = sp.id AND user_id = ${userId}) as user_liked
        FROM social_posts sp
        JOIN users u ON sp.user_id = u.user_id
        WHERE sp.user_id IN (
          SELECT following_id FROM user_connections WHERE follower_id = ${userId}
        ) OR sp.user_id = ${userId}
        ORDER BY sp.created_at DESC
        LIMIT 50
      `
    } else if (feedType === "gym" && userId) {
      // Buscar posts da mesma academia
      posts = await sql`
        SELECT 
          sp.*,
          u.user_id, u.name as user_name, u.weight, u.height,
          EXISTS(SELECT 1 FROM post_likes WHERE post_id = sp.id AND user_id = ${userId}) as user_liked
        FROM social_posts sp
        JOIN users u ON sp.user_id = u.user_id
        WHERE u.partner_gym_id = (SELECT partner_gym_id FROM users WHERE user_id = ${userId})
        AND u.partner_gym_id IS NOT NULL
        ORDER BY sp.created_at DESC
        LIMIT 50
      `
    } else {
      // Explorar posts públicos
      posts = await sql`
        SELECT 
          sp.*,
          u.user_id, u.name as user_name, u.weight, u.height,
          ${userId ? sql`EXISTS(SELECT 1 FROM post_likes WHERE post_id = sp.id AND user_id = ${userId})` : sql`false`} as user_liked
        FROM social_posts sp
        JOIN users u ON sp.user_id = u.user_id
        WHERE sp.visibility = 'public'
        ORDER BY sp.created_at DESC
        LIMIT 50
      `
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, postType, content, mediaUrl, workoutData, visibility } = body

    const result = await sql`
      INSERT INTO social_posts (user_id, post_type, content, media_url, workout_data, visibility)
      VALUES (${userId}, ${postType}, ${content}, ${mediaUrl}, ${workoutData ? JSON.stringify(workoutData) : null}, ${visibility || "public"})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
