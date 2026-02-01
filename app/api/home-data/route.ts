import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// API otimizada que busca TODOS os dados da home em uma única chamada
// Reduz latência de 5+ chamadas paralelas para apenas 1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const today = new Date().toISOString().split("T")[0]
    const dayOfWeek = new Date().getDay()

    // Executar TODAS as queries em paralelo para máxima performance
    const [
      userProfile,
      todayCheckins,
      todaySchedule,
      loyaltyPoints,
      progression
    ] = await Promise.all([
      // 1. Perfil do usuário (inclui peso atual)
      sql`
        SELECT user_id, name, pin, height, target_weight, current_weight, gender, age, initial_weight, start_date, email, profile_photo_url, cpf
        FROM users
        WHERE user_id = ${userId}
      `,
      
      // 2. Check-ins de hoje
      sql`
        SELECT checkin_type FROM daily_checkins 
        WHERE user_id = ${userId} AND checkin_date = ${today}
      `,
      
      // 3. Cronograma do dia
      sql`
        SELECT workout_name, description
        FROM weekly_workout_schedule 
        WHERE user_id = ${userId} AND day_of_week = ${dayOfWeek}
        LIMIT 1
      `,
      
      // 4. Pontos de fidelidade (query simplificada)
      sql`
        SELECT total_points, lifetime_points, current_level, cashback_balance, current_streak
        FROM user_loyalty_points 
        WHERE user_id = ${userId}
      `,
      
      // 5. Progressão ativa
      sql`
        SELECT * FROM workout_progressions 
        WHERE user_id = ${userId} AND active = true
        ORDER BY start_date DESC
        LIMIT 1
      `
    ])

    // Se não encontrou perfil, retorna erro
    if (userProfile.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Processar check-ins de hoje
    const hasWorkoutToday = todayCheckins.some((c: any) => c.checkin_type === "workout")
    const hasRunToday = todayCheckins.some((c: any) => c.checkin_type === "running")

    // Processar cronograma
    const schedule = todaySchedule.length > 0 
      ? { workout_name: todaySchedule[0].workout_name, description: todaySchedule[0].description }
      : { workout_name: "Não definido", description: "Configure seu cronograma semanal" }

    // Processar fidelidade - criar registro se não existir
    let loyalty = loyaltyPoints[0] || null
    if (!loyalty) {
      // Criar registro inicial de fidelidade de forma assíncrona (não bloqueia resposta)
      sql`
        INSERT INTO user_loyalty_points (user_id, total_points, lifetime_points, current_level)
        VALUES (${userId}, 0, 0, 'Bronze')
        ON CONFLICT (user_id) DO NOTHING
      `.catch(() => {})
      
      loyalty = {
        total_points: 0,
        lifetime_points: 0,
        current_level: 'Bronze',
        cashback_balance: 0,
        current_streak: 0
      }
    }

    // Retornar todos os dados em uma única resposta
    return NextResponse.json({
      success: true,
      data: {
        profile: userProfile[0],
        today: {
          hasWorkout: hasWorkoutToday,
          hasRun: hasRunToday,
          schedule
        },
        loyalty: {
          total_points: loyalty.total_points || 0,
          current_level: loyalty.current_level || 'Bronze',
          cashback_balance: loyalty.cashback_balance || 0,
          current_streak: loyalty.current_streak || 0
        },
        progression: progression[0] || null
      }
    })
  } catch (error) {
    console.error("[v0] Error fetching home data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch home data" }, { status: 500 })
  }
}
