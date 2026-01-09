import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  }

  try {
    const users = await sql`
      SELECT user_id, name, pin, height, target_weight, gender, age, initial_weight, start_date 
      FROM users
      WHERE user_id = ${userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: users[0] })
  } catch (error) {
    console.error("[v0] Error fetching user profile:", error)
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, height, targetWeight, gender } = body

    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    }

    const result = await sql`
      UPDATE users
      SET 
        height = COALESCE(${height}, height),
        target_weight = COALESCE(${targetWeight}, target_weight),
        gender = COALESCE(${gender}, gender)
      WHERE user_id = ${userId}
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error updating user profile:", error)
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 })
  }
}
