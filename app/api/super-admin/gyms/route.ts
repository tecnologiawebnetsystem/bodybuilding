import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const gyms = await sql`
      SELECT 
        g.*,
        COUNT(DISTINCT u.user_id) as total_students
      FROM gyms g
      LEFT JOIN users u ON u.gym_id = g.id AND u.role = 'student'
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `

    return NextResponse.json(gyms)
  } catch (error) {
    console.error("[v0] Erro ao buscar academias:", error)
    return NextResponse.json({ error: "Erro ao buscar academias" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { gym_name, cnpj, phone, email, address, city, state, zip_code } = body

    const result = await sql`
      INSERT INTO gyms (gym_name, cnpj, phone, email, address, city, state, zip_code)
      VALUES (${gym_name}, ${cnpj}, ${phone}, ${email}, ${address}, ${city}, ${state}, ${zip_code})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Erro ao criar academia:", error)
    return NextResponse.json({ error: "Erro ao criar academia" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, gym_name, cnpj, phone, email, address, city, state, zip_code, is_active } = body

    const result = await sql`
      UPDATE gyms 
      SET gym_name = ${gym_name}, cnpj = ${cnpj}, phone = ${phone}, 
          email = ${email}, address = ${address}, city = ${city}, 
          state = ${state}, zip_code = ${zip_code}, is_active = ${is_active}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Erro ao atualizar academia:", error)
    return NextResponse.json({ error: "Erro ao atualizar academia" }, { status: 500 })
  }
}
