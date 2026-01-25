import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Get post
    const result = await sql`
      SELECT 
        bp.*,
        bc.name as category_name,
        bc.slug as category_slug,
        bc.icon as category_icon
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE bp.slug = ${slug} AND bp.published = true
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const post = result.rows[0]

    // Increment views
    await sql`UPDATE blog_posts SET views = views + 1 WHERE slug = ${slug}`

    // Get related posts
    const related = await sql`
      SELECT id, title, slug, excerpt, cover_image, reading_time, published_at
      FROM blog_posts 
      WHERE category_id = ${post.category_id} 
        AND slug != ${slug} 
        AND published = true
      ORDER BY published_at DESC
      LIMIT 3
    `

    return NextResponse.json({
      post,
      related: related.rows
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}
