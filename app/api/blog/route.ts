import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = Number(searchParams.get("limit")) || 50
    const offset = Number(searchParams.get("offset")) || 0
    const search = searchParams.get("search")

    let query = `
      SELECT 
        bp.*,
        bc.name as category_name,
        bc.slug as category_slug,
        bc.icon as category_icon
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE bp.published = true
    `

    const conditions: string[] = []
    
    if (category) {
      conditions.push(`bc.slug = '${category}'`)
    }
    
    if (featured === "true") {
      conditions.push(`bp.featured = true`)
    }

    if (search) {
      conditions.push(`(bp.title ILIKE '%${search}%' OR bp.excerpt ILIKE '%${search}%' OR bp.content ILIKE '%${search}%')`)
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(" AND ")}`
    }

    query += ` ORDER BY bp.featured DESC, bp.published_at DESC LIMIT ${limit} OFFSET ${offset}`

    const posts = await sql.query(query)

    // Get categories with post count
    const categories = await sql`
      SELECT 
        bc.*,
        COUNT(bp.id) as post_count
      FROM blog_categories bc
      LEFT JOIN blog_posts bp ON bc.id = bp.category_id AND bp.published = true
      GROUP BY bc.id
      ORDER BY bc.name
    `

    // Get total count
    const countResult = await sql`SELECT COUNT(*) as total FROM blog_posts WHERE published = true`
    const total = countResult.rows[0]?.total || 0

    return NextResponse.json({
      posts: posts.rows,
      categories: categories.rows,
      total: Number(total),
      limit,
      offset
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
