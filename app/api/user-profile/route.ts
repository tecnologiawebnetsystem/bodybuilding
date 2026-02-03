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
      SELECT user_id, name, pin, height, target_weight, current_weight, gender, age, initial_weight, start_date, email, profile_photo_url, cpf, theme_primary, theme_secondary, theme_accent
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
    const { userId, height, targetWeight, currentWeight, gender } = body

    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    }

    const result = await sql`
      UPDATE users
      SET 
        height = COALESCE(${height}, height),
        target_weight = COALESCE(${targetWeight}, target_weight),
        current_weight = COALESCE(${currentWeight}, current_weight),
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, pin, email, profilePhoto, cpf, currentPin } = body

    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    }

    if (pin) {
      if (!currentPin) {
        return NextResponse.json({ error: "PIN atual é obrigatório", success: false }, { status: 400 })
      }

      if (pin.length !== 6) {
        return NextResponse.json({ error: "Novo PIN deve ter 6 dígitos", success: false }, { status: 400 })
      }

      // Verificar PIN atual
      const userCheck = await sql`
        SELECT user_id FROM users WHERE user_id = ${userId} AND pin = ${currentPin}
      `

      if (userCheck.length === 0) {
        return NextResponse.json(
          { error: "PIN atual incorreto", success: false, message: "PIN atual incorreto" },
          { status: 401 },
        )
      }

      const result = await sql`
        UPDATE users
        SET pin = ${pin}
        WHERE user_id = ${userId}
        RETURNING user_id, name
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Usuário não encontrado", success: false }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: result[0] })
    }

    if (cpf !== undefined) {
      if (!currentPin) {
        return NextResponse.json({ error: "PIN atual é obrigatório", success: false }, { status: 400 })
      }

      // Verificar PIN atual
      const userCheck = await sql`
        SELECT user_id FROM users WHERE user_id = ${userId} AND pin = ${currentPin}
      `

      if (userCheck.length === 0) {
        return NextResponse.json(
          {
            error: "PIN atual incorreto",
            success: false,
            message: "PIN atual incorreto",
          },
          { status: 401 },
        )
      }

      const result = await sql`
        UPDATE users
        SET cpf = ${cpf}
        WHERE user_id = ${userId}
        RETURNING user_id, name, cpf
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Usuário não encontrado", success: false }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: result[0] })
    }

    if (email !== undefined) {
      const result = await sql`
        UPDATE users
        SET email = ${email}
        WHERE user_id = ${userId}
        RETURNING user_id, name, email
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: result[0] })
    }

    if (profilePhoto !== undefined) {
      const result = await sql`
        UPDATE users
        SET profile_photo_url = ${profilePhoto}
        WHERE user_id = ${userId}
        RETURNING user_id, name, profile_photo_url
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: result[0] })
    }

    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}
