import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  }

  try {
    // Buscar dados do usuário
    const users = await sql`
      SELECT height, gender, target_weight 
      FROM users
      WHERE user_id = ${userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const user = users[0]
    const heightCm = Number.parseFloat(user.height)
    const heightM = heightCm / 100
    const gender = user.gender

    if (!heightCm || !gender) {
      return NextResponse.json({ error: "Dados insuficientes para cálculo" }, { status: 400 })
    }

    // Fórmula de Devine (mais usada)
    let idealWeightDevine = 0
    if (gender === "male") {
      idealWeightDevine = 50 + 2.3 * ((heightCm - 152.4) / 2.54)
    } else {
      idealWeightDevine = 45.5 + 2.3 * ((heightCm - 152.4) / 2.54)
    }

    // Fórmula de Robinson
    let idealWeightRobinson = 0
    if (gender === "male") {
      idealWeightRobinson = 52 + 1.9 * ((heightCm - 152.4) / 2.54)
    } else {
      idealWeightRobinson = 49 + 1.7 * ((heightCm - 152.4) / 2.54)
    }

    // Fórmula de Miller
    let idealWeightMiller = 0
    if (gender === "male") {
      idealWeightMiller = 56.2 + 1.41 * ((heightCm - 152.4) / 2.54)
    } else {
      idealWeightMiller = 53.1 + 1.36 * ((heightCm - 152.4) / 2.54)
    }

    // Faixa de IMC saudável (18.5 - 24.9)
    const minHealthyWeight = 18.5 * Math.pow(heightM, 2)
    const maxHealthyWeight = 24.9 * Math.pow(heightM, 2)

    // Média das fórmulas como peso ideal recomendado
    const averageIdealWeight = (idealWeightDevine + idealWeightRobinson + idealWeightMiller) / 3

    return NextResponse.json({
      success: true,
      data: {
        idealWeightDevine: Number.parseFloat(idealWeightDevine.toFixed(1)),
        idealWeightRobinson: Number.parseFloat(idealWeightRobinson.toFixed(1)),
        idealWeightMiller: Number.parseFloat(idealWeightMiller.toFixed(1)),
        averageIdealWeight: Number.parseFloat(averageIdealWeight.toFixed(1)),
        minHealthyWeight: Number.parseFloat(minHealthyWeight.toFixed(1)),
        maxHealthyWeight: Number.parseFloat(maxHealthyWeight.toFixed(1)),
        userTargetWeight: user.target_weight ? Number.parseFloat(user.target_weight) : null,
        height: heightCm,
        gender: gender,
      },
    })
  } catch (error) {
    console.error("[v0] Error calculating ideal weight:", error)
    return NextResponse.json({ error: "Erro ao calcular peso ideal" }, { status: 500 })
  }
}
