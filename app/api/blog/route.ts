import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = Number(searchParams.get("limit")) || 50
    const offset = Number(searchParams.get("offset")) || 0
    const search = searchParams.get("search")

    let posts

    if (category && search) {
      posts = await sql`
        SELECT 
          bp.*,
          json_build_object('id', bc.id, 'name', bc.name, 'slug', bc.slug, 'icon', bc.icon) as category
        FROM blog_posts bp
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        WHERE bp.published = true 
          AND bc.slug = ${category}
          AND (bp.title ILIKE ${'%' + search + '%'} OR bp.excerpt ILIKE ${'%' + search + '%'})
        ORDER BY bp.created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (category) {
      posts = await sql`
        SELECT 
          bp.*,
          json_build_object('id', bc.id, 'name', bc.name, 'slug', bc.slug, 'icon', bc.icon) as category
        FROM blog_posts bp
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        WHERE bp.published = true AND bc.slug = ${category}
        ORDER BY bp.created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (search) {
      posts = await sql`
        SELECT 
          bp.*,
          json_build_object('id', bc.id, 'name', bc.name, 'slug', bc.slug, 'icon', bc.icon) as category
        FROM blog_posts bp
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        WHERE bp.published = true 
          AND (bp.title ILIKE ${'%' + search + '%'} OR bp.excerpt ILIKE ${'%' + search + '%'})
        ORDER BY bp.created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      posts = await sql`
        SELECT 
          bp.*,
          json_build_object('id', bc.id, 'name', bc.name, 'slug', bc.slug, 'icon', bc.icon) as category
        FROM blog_posts bp
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        WHERE bp.published = true
        ORDER BY bp.created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Get categories with post count
    const categories = await sql`
      SELECT 
        bc.*,
        COUNT(bp.id)::int as post_count
      FROM blog_categories bc
      LEFT JOIN blog_posts bp ON bc.id = bp.category_id AND bp.published = true
      GROUP BY bc.id
      ORDER BY bc.name
    `

    // Get total count
    const countResult = await sql`SELECT COUNT(*)::int as total FROM blog_posts WHERE published = true`
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      posts: posts,
      categories: categories,
      total: Number(total),
      limit,
      offset
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts", details: String(error) }, { status: 500 })
  }
}
