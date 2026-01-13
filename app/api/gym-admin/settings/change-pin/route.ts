import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { current_pin, new_pin } = body

    // Verificar PIN atual
    const result = await sql`
      SELECT user_id FROM users 
      WHERE role = 'gym_admin' AND gym_id = 1 AND pin = ${current_pin}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "PIN atual incorreto" }, { status: 401 })
    }

    // Atualizar para o novo PIN
    await sql`
      UPDATE users 
      SET pin = ${new_pin}
      WHERE role = 'gym_admin' AND gym_id = 1
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar PIN:", error)
    return NextResponse.json({ error: "Erro ao atualizar PIN" }, { status: 500 })
  }
}
