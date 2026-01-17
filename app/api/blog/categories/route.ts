import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const categories = await sql`
      SELECT c.*, COUNT(p.id)::int as posts_count
      FROM blog_categories c
      LEFT JOIN blog_posts p ON p.category_id = c.id AND p.published = true
      GROUP BY c.id
      ORDER BY c.name
    `

    return NextResponse.json(
      categories.map((cat) => ({
        ...cat,
        _count: { posts: cat.posts_count },
      })),
    )
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 })
  }
}
