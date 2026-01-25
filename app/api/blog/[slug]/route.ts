import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const { slug } = await params

    // Get post
    const result = await sql`
      SELECT 
        bp.*,
        json_build_object('id', bc.id, 'name', bc.name, 'slug', bc.slug, 'icon', bc.icon) as category
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE bp.slug = ${slug} AND bp.published = true
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const post = result[0]

    // Increment views
    await sql`UPDATE blog_posts SET views = COALESCE(views, 0) + 1 WHERE slug = ${slug}`

    // Get related posts
    const related = await sql`
      SELECT id, title, slug, excerpt, image_url, created_at
      FROM blog_posts 
      WHERE category_id = ${post.category_id} 
        AND slug != ${slug} 
        AND published = true
      ORDER BY created_at DESC
      LIMIT 3
    `

    return NextResponse.json({
      post,
      related: related
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch post", details: String(error) }, { status: 500 })
  }
}
