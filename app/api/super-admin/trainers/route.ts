import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const trainers = await sql`
      SELECT 
        pt.*,
        g.gym_name,
        COUNT(DISTINCT u.user_id) as total_students,
        SUM(pt.price_per_student) as total_revenue
      FROM personal_trainers pt
      LEFT JOIN gyms g ON g.id = pt.gym_id
      LEFT JOIN users u ON u.trainer_id = pt.id AND u.role = 'student'
      GROUP BY pt.id, g.gym_name
      ORDER BY pt.created_at DESC
    `

    return NextResponse.json(trainers)
  } catch (error) {
    console.error("[v0] Erro ao buscar trainers:", error)
    return NextResponse.json({ error: "Erro ao buscar trainers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, name, email, phone, cpf, gym_id, price_per_student } = body

    const result = await sql`
      INSERT INTO personal_trainers (user_id, name, email, phone, cpf, gym_id, price_per_student)
      VALUES (${user_id}, ${name}, ${email}, ${phone}, ${cpf}, ${gym_id}, ${price_per_student})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Erro ao criar trainer:", error)
    return NextResponse.json({ error: "Erro ao criar trainer" }, { status: 500 })
  }
}
