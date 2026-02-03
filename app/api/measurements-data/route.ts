import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// API combinada para carregar todos os dados de medidas em uma única chamada
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  }

  try {
    // Buscar usuário primeiro
    const usersResult = await sql`
      SELECT user_id, name, pin, height, target_weight, current_weight, gender, age, initial_weight, start_date, email, profile_photo_url, cpf, theme_primary, theme_secondary, theme_accent
      FROM users
      WHERE user_id = ${userId}
    `

    if (usersResult.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Buscar medidas (pode não existir a tabela ou não ter dados)
    let measurementsResult: any[] = []
    try {
      measurementsResult = await sql`
        SELECT * FROM body_measurements
        WHERE user_id = ${userId}
        ORDER BY measurement_date DESC
        LIMIT 50
      `
    } catch {
      // Tabela pode não existir ainda
      measurementsResult = []
    }

    const user = usersResult[0]
    
    // Calcular peso ideal se houver dados suficientes
    let idealWeightData = null
    const heightCm = Number.parseFloat(user.height)
    const gender = user.gender

    if (heightCm && gender) {
      const heightM = heightCm / 100

      // Fórmula de Devine
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

      idealWeightData = {
        idealWeightDevine: Number.parseFloat(idealWeightDevine.toFixed(1)),
        idealWeightRobinson: Number.parseFloat(idealWeightRobinson.toFixed(1)),
        idealWeightMiller: Number.parseFloat(idealWeightMiller.toFixed(1)),
        averageIdealWeight: Number.parseFloat(averageIdealWeight.toFixed(1)),
        minHealthyWeight: Number.parseFloat(minHealthyWeight.toFixed(1)),
        maxHealthyWeight: Number.parseFloat(maxHealthyWeight.toFixed(1)),
        userTargetWeight: user.target_weight ? Number.parseFloat(user.target_weight) : null,
        height: heightCm,
        gender: gender,
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        userProfile: user,
        measurements: measurementsResult,
        idealWeight: idealWeightData
      }
    })
  } catch (error) {
    console.error("[v0] Error fetching measurements data:", error)
    return NextResponse.json({ error: "Erro ao buscar dados de medidas" }, { status: 500 })
  }
}
