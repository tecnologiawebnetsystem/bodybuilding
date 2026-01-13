import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const totalGyms = await sql`SELECT COUNT(*) as count FROM gyms WHERE is_active = true`
    const totalTrainers = await sql`SELECT COUNT(*) as count FROM personal_trainers WHERE is_active = true`
    const totalStudents = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'student'`

    const gymStats = await sql`
      SELECT 
        g.gym_name,
        COUNT(DISTINCT u.user_id) as students
      FROM gyms g
      LEFT JOIN users u ON u.gym_id = g.id AND u.role = 'student'
      WHERE g.is_active = true
      GROUP BY g.id, g.gym_name
      ORDER BY students DESC
      LIMIT 5
    `

    return NextResponse.json({
      totalGyms: Number(totalGyms[0]?.count || 0),
      totalTrainers: Number(totalTrainers[0]?.count || 0),
      totalStudents: Number(totalStudents[0]?.count || 0),
      topGyms: gymStats,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar estatísticas:", error)
    return NextResponse.json(
      {
        totalGyms: 0,
        totalTrainers: 0,
        totalStudents: 0,
        topGyms: [],
      },
      { status: 500 },
    )
  }
}
