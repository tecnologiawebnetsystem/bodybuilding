import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const { cpf, pin } = await request.json()

    console.log("[v0] Login attempt - CPF recebido:", cpf)
    console.log("[v0] Login attempt - PIN recebido:", pin)

    const sql = neon(process.env.DATABASE_URL!)

    const cpfLimpo = cpf.replace(/[.-]/g, "")

    console.log("[v0] CPF limpo:", cpfLimpo)

    const users = await sql`
      SELECT user_id, name, email, role, gym_id, cpf, pin
      FROM users 
      WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ${cpfLimpo} 
        AND pin = ${pin} 
        AND role IN ('student', 'super_admin')
    `

    console.log("[v0] Usuários encontrados:", users.length)

    if (users.length === 0) {
      return NextResponse.json({ error: "CPF ou PIN incorretos" }, { status: 401 })
    }

    const user = users[0]

    return NextResponse.json({
      success: true,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        gymId: user.gym_id,
        role: user.role, // Incluindo role na resposta
      },
    })
  } catch (error) {
    console.error("[v0] Erro no login:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
