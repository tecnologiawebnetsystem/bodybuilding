import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    let posts

    if (category) {
      posts = await sql`
        SELECT p.*, 
               json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
        FROM blog_posts p
        JOIN blog_categories c ON c.id = p.category_id
        WHERE p.published = true AND c.slug = ${category}
        ORDER BY p.created_at DESC
      `
    } else {
      posts = await sql`
        SELECT p.*, 
               json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
        FROM blog_posts p
        JOIN blog_categories c ON c.id = p.category_id
        WHERE p.published = true
        ORDER BY p.created_at DESC
      `
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Erro ao buscar posts:", error)
    return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 })
  }
}
