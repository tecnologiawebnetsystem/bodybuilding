import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Verifica se o CPF existe no sistema e retorna o nome do usuario
export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const body = await request.json()
    const { cpf } = body

    if (!cpf) {
      return NextResponse.json({ error: "CPF obrigatorio" }, { status: 400 })
    }

    // Limpar CPF
    const cleanCPF = cpf.replace(/\D/g, "")

    if (cleanCPF.length !== 11) {
      return NextResponse.json({ error: "CPF invalido" }, { status: 400 })
    }

    // Buscar usuario pelo CPF
    const users = await sql`
      SELECT user_id, name, email, role, account_type
      FROM users 
      WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ${cleanCPF}
      LIMIT 1
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "CPF nao cadastrado" }, { status: 404 })
    }

    const user = users[0]

    return NextResponse.json({
      success: true,
      name: user.name,
      hasAccount: true
    })
  } catch (error) {
    console.error("[Auth] Check CPF error:", error)
    return NextResponse.json({ error: "Erro ao verificar CPF" }, { status: 500 })
  }
}
