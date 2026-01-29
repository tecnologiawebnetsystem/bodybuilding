import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Buscar desafios e progresso
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId obrigatorio" }, { status: 400 })
    }

    // Buscar desafios ativos com progresso do usuario
    const challenges = await sql`
      SELECT 
        c.*,
        COALESCE(p.current_value, 0) as current_value,
        COALESCE(p.is_completed, false) as is_completed,
        p.completed_at,
        p.points_earned
      FROM loyalty_challenges c
      LEFT JOIN user_challenge_progress p ON c.id = p.challenge_id AND p.user_id = ${userId}
      WHERE c.is_active = true
      AND (c.end_date IS NULL OR c.end_date >= CURRENT_DATE)
      ORDER BY 
        COALESCE(p.is_completed, false) ASC,
        c.points_reward DESC
    `

    // Separar por categoria
    const daily = challenges.filter((c: any) => c.challenge_type === 'daily')
    const weekly = challenges.filter((c: any) => c.challenge_type === 'weekly')
    const monthly = challenges.filter((c: any) => c.challenge_type === 'monthly')
    const special = challenges.filter((c: any) => c.challenge_type === 'special')

    return NextResponse.json({
      success: true,
      data: {
        all: challenges,
        daily,
        weekly,
        monthly,
        special,
        totalCompleted: challenges.filter((c: any) => c.is_completed).length,
        totalAvailable: challenges.length
      }
    })
  } catch (error) {
    console.error("Erro ao buscar desafios:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Atualizar progresso de desafio
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, challengeId, incrementValue } = body

    if (!userId || !challengeId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Buscar desafio
    const challenges = await sql`
      SELECT * FROM loyalty_challenges WHERE id = ${challengeId} AND is_active = true
    `

    if (challenges.length === 0) {
      return NextResponse.json({ error: "Desafio nao encontrado" }, { status: 404 })
    }

    const challenge = challenges[0]

    // Buscar ou criar progresso
    let progress = await sql`
      SELECT * FROM user_challenge_progress 
      WHERE user_id = ${userId} AND challenge_id = ${challengeId}
    `

    if (progress.length === 0) {
      await sql`
        INSERT INTO user_challenge_progress (user_id, challenge_id, current_value)
        VALUES (${userId}, ${challengeId}, 0)
      `
      progress = await sql`
        SELECT * FROM user_challenge_progress 
        WHERE user_id = ${userId} AND challenge_id = ${challengeId}
      `
    }

    // Se ja completou, retornar
    if (progress[0].is_completed) {
      return NextResponse.json({
        success: true,
        data: {
          alreadyCompleted: true,
          message: "Desafio ja foi completado"
        }
      })
    }

    // Incrementar progresso
    const newValue = progress[0].current_value + (incrementValue || 1)
    const isCompleted = newValue >= challenge.target_value

    await sql`
      UPDATE user_challenge_progress 
      SET 
        current_value = ${newValue},
        is_completed = ${isCompleted},
        completed_at = ${isCompleted ? new Date().toISOString() : null},
        points_earned = ${isCompleted ? challenge.points_reward : 0}
      WHERE user_id = ${userId} AND challenge_id = ${challengeId}
    `

    // Se completou, dar os pontos
    if (isCompleted) {
      // Buscar dados do usuario
      const userPoints = await sql`
        SELECT * FROM user_loyalty_points WHERE user_id = ${userId}
      `

      const newTotalPoints = (userPoints[0]?.total_points || 0) + challenge.points_reward
      const newLifetimePoints = (userPoints[0]?.lifetime_points || 0) + challenge.points_reward
      const newCashback = (userPoints[0]?.cashback_balance || 0) + parseFloat(challenge.bonus_cashback || 0)

      await sql`
        UPDATE user_loyalty_points 
        SET 
          total_points = ${newTotalPoints},
          lifetime_points = ${newLifetimePoints},
          cashback_balance = ${newCashback},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
      `

      // Registrar transacao
      await sql`
        INSERT INTO loyalty_transactions (user_id, transaction_type, points, description, reference_type, reference_id, balance_after)
        VALUES (${userId}, 'bonus', ${challenge.points_reward}, ${'Desafio completado: ' + challenge.name}, 'challenge', ${challengeId.toString()}, ${newTotalPoints})
      `

      return NextResponse.json({
        success: true,
        data: {
          completed: true,
          pointsEarned: challenge.points_reward,
          cashbackEarned: challenge.bonus_cashback,
          newBalance: newTotalPoints,
          message: `Parabens! Voce completou o desafio "${challenge.name}" e ganhou ${challenge.points_reward} pontos!`
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        completed: false,
        currentValue: newValue,
        targetValue: challenge.target_value,
        progress: (newValue / challenge.target_value) * 100
      }
    })
  } catch (error) {
    console.error("Erro ao atualizar progresso:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
