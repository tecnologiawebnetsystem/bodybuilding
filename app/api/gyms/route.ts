import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const gyms = await sql`
      SELECT id, gym_name, email, city, state, is_active
      FROM gyms
      WHERE is_active = true
      ORDER BY gym_name
    `

    return Response.json({ gyms })
  } catch (error) {
    console.error("[v0] Erro ao buscar academias:", error)
    return Response.json({ error: "Erro ao buscar academias" }, { status: 500 })
  }
}
