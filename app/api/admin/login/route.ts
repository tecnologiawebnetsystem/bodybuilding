import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Admin login attempt:", username)

    // Buscar admin no banco
    const result = await sql`
      SELECT * FROM admins 
      WHERE username = ${username} AND password_hash = ${password}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Atualizar último login
    await sql`
      UPDATE admins 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE username = ${username}
    `

    // Log da ação
    await sql`
      INSERT INTO admin_audit_log (admin_username, action, details)
      VALUES (${username}, 'LOGIN', 'Admin fez login no sistema')
    `

    return NextResponse.json({
      success: true,
      admin: {
        username: result[0].username,
        email: result[0].email,
      },
    })
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
