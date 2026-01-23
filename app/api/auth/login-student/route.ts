import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const { cpf, pin, userType } = await request.json()

    const sql = neon(process.env.DATABASE_URL!)

    const cpfLimpo = cpf.replace(/[.-]/g, "")

    // Definir roles permitidos baseado no tipo de usuario selecionado
    let allowedRoles: string[] = []
    
    switch (userType) {
      case "gym":
        allowedRoles = ["gym_admin", "super_admin"]
        break
      case "trainer":
        allowedRoles = ["trainer", "super_admin"]
        break
      case "superadmin":
        allowedRoles = ["super_admin"]
        break
      default: // student
        allowedRoles = ["student", "super_admin"]
    }

    const users = await sql`
      SELECT user_id, name, email, role, gym_id, cpf, pin
      FROM users 
      WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ${cpfLimpo} 
        AND pin = ${pin} 
        AND role = ANY(${allowedRoles})
    `

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
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Erro no login:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
