import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Buscar dados de fidelidade do usuario
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId obrigatorio" }, { status: 400 })
    }

    // Buscar ou criar registro de pontos do usuario
    let userPoints = await sql`
      SELECT * FROM user_loyalty_points WHERE user_id = ${userId}
    `

    if (userPoints.length === 0) {
      // Criar registro inicial
      await sql`
        INSERT INTO user_loyalty_points (user_id, total_points, lifetime_points, current_level)
        VALUES (${userId}, 0, 0, 'Bronze')
      `
      userPoints = await sql`
        SELECT * FROM user_loyalty_points WHERE user_id = ${userId}
      `
    }

    // Buscar nivel atual
    const levels = await sql`
      SELECT * FROM loyalty_levels 
      WHERE min_points <= ${userPoints[0].lifetime_points}
      ORDER BY min_points DESC
      LIMIT 1
    `

    // Buscar proximo nivel
    const nextLevel = await sql`
      SELECT * FROM loyalty_levels 
      WHERE min_points > ${userPoints[0].lifetime_points}
      ORDER BY min_points ASC
      LIMIT 1
    `

    // Buscar ultimas transacoes
    const recentTransactions = await sql`
      SELECT * FROM loyalty_transactions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Buscar desafios ativos e progresso
    const challenges = await sql`
      SELECT 
        c.*,
        COALESCE(p.current_value, 0) as current_value,
        COALESCE(p.is_completed, false) as is_completed
      FROM loyalty_challenges c
      LEFT JOIN user_challenge_progress p ON c.id = p.challenge_id AND p.user_id = ${userId}
      WHERE c.is_active = true
      AND (c.end_date IS NULL OR c.end_date >= CURRENT_DATE)
      ORDER BY c.points_reward DESC
    `

    // Calcular pontos para proximo nivel
    const pointsToNextLevel = nextLevel.length > 0 
      ? nextLevel[0].min_points - userPoints[0].lifetime_points 
      : 0

    // Calcular progresso percentual para proximo nivel
    const currentLevelMin = levels.length > 0 ? levels[0].min_points : 0
    const nextLevelMin = nextLevel.length > 0 ? nextLevel[0].min_points : userPoints[0].lifetime_points
    const levelProgress = nextLevel.length > 0
      ? ((userPoints[0].lifetime_points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100
      : 100

    return NextResponse.json({
      success: true,
      data: {
        points: userPoints[0],
        currentLevel: levels[0] || { name: 'Bronze', points_multiplier: 1.00, cashback_percentage: 1.0, badge_color: '#CD7F32' },
        nextLevel: nextLevel[0] || null,
        pointsToNextLevel,
        levelProgress: Math.min(levelProgress, 100),
        recentTransactions,
        challenges,
      }
    })
  } catch (error) {
    console.error("Erro ao buscar dados de fidelidade:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Adicionar pontos ao usuario
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, points, type, description, referenceType, referenceId } = body

    if (!userId || points === undefined || !type) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Buscar dados atuais do usuario
    let userPoints = await sql`
      SELECT * FROM user_loyalty_points WHERE user_id = ${userId}
    `

    if (userPoints.length === 0) {
      await sql`
        INSERT INTO user_loyalty_points (user_id, total_points, lifetime_points, current_level)
        VALUES (${userId}, 0, 0, 'Bronze')
      `
      userPoints = await sql`
        SELECT * FROM user_loyalty_points WHERE user_id = ${userId}
      `
    }

    // Buscar nivel atual para aplicar multiplicador
    const currentLevel = await sql`
      SELECT * FROM loyalty_levels 
      WHERE min_points <= ${userPoints[0].lifetime_points}
      ORDER BY min_points DESC
      LIMIT 1
    `

    // Aplicar multiplicador de nivel nos pontos ganhos
    let finalPoints = points
    if (type === 'earn' && currentLevel.length > 0) {
      finalPoints = Math.floor(points * currentLevel[0].points_multiplier)
    }

    // Calcular cashback se aplicavel
    let cashbackAmount = 0
    if (type === 'earn' && currentLevel.length > 0) {
      // Cashback baseado no percentual do nivel (ex: 1% de 10 pontos = R$0.10)
      cashbackAmount = (finalPoints / 100) * currentLevel[0].cashback_percentage
    }

    // Atualizar saldo
    const newTotalPoints = type === 'earn' || type === 'bonus'
      ? userPoints[0].total_points + finalPoints
      : userPoints[0].total_points - Math.abs(finalPoints)

    const newLifetimePoints = type === 'earn' || type === 'bonus'
      ? userPoints[0].lifetime_points + finalPoints
      : userPoints[0].lifetime_points

    const newCashback = userPoints[0].cashback_balance + cashbackAmount

    // Verificar novo nivel
    const newLevel = await sql`
      SELECT name FROM loyalty_levels 
      WHERE min_points <= ${newLifetimePoints}
      ORDER BY min_points DESC
      LIMIT 1
    `

    await sql`
      UPDATE user_loyalty_points 
      SET 
        total_points = ${newTotalPoints},
        lifetime_points = ${newLifetimePoints},
        cashback_balance = ${newCashback},
        current_level = ${newLevel[0]?.name || 'Bronze'},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    // Registrar transacao
    await sql`
      INSERT INTO loyalty_transactions (user_id, transaction_type, points, description, reference_type, reference_id, balance_after)
      VALUES (${userId}, ${type}, ${finalPoints}, ${description}, ${referenceType}, ${referenceId}, ${newTotalPoints})
    `

    // Se subiu de nivel, registrar bonus
    if (newLevel[0]?.name !== userPoints[0].current_level) {
      await sql`
        INSERT INTO loyalty_transactions (user_id, transaction_type, points, description, reference_type, balance_after)
        VALUES (${userId}, 'bonus', 50, ${'Parabens! Voce subiu para o nivel ' + newLevel[0]?.name}, 'level_up', ${newTotalPoints + 50})
      `
      await sql`
        UPDATE user_loyalty_points SET total_points = total_points + 50, lifetime_points = lifetime_points + 50 WHERE user_id = ${userId}
      `
    }

    return NextResponse.json({
      success: true,
      data: {
        pointsEarned: finalPoints,
        cashbackEarned: cashbackAmount,
        newBalance: newTotalPoints,
        newLevel: newLevel[0]?.name || 'Bronze',
        leveledUp: newLevel[0]?.name !== userPoints[0].current_level
      }
    })
  } catch (error) {
    console.error("Erro ao adicionar pontos:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
