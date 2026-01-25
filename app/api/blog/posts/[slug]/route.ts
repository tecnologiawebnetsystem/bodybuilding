import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }
    const sql = neon(databaseUrl)
    const { slug } = params

    const posts = await sql`
      SELECT p.*, 
             json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon) as category
      FROM blog_posts p
      JOIN blog_categories c ON c.id = p.category_id
      WHERE p.slug = ${slug} AND p.published = true
    `

    if (posts.length === 0) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 })
    }

    await sql`UPDATE blog_posts SET views = views + 1 WHERE slug = ${slug}`

    return NextResponse.json(posts[0])
  } catch (error) {
    console.error("Erro ao buscar post:", error)
    return NextResponse.json({ error: "Erro ao buscar post" }, { status: 500 })
  }
}
