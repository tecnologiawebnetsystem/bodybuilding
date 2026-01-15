import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const contracts = await sql`
      SELECT c.*, u.name as student_name
      FROM gym_contracts c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.gym_id = 1
      ORDER BY c.created_at DESC
    `

    return Response.json({ contracts })
  } catch (error) {
    return Response.json({ error: "Erro ao buscar contratos" }, { status: 500 })
  }
}
