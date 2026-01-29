import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Listar recompensas disponiveis
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const category = searchParams.get("category")

    // Buscar recompensas ativas
    let rewards
    if (category && category !== 'all') {
      rewards = await sql`
        SELECT * FROM loyalty_rewards 
        WHERE is_active = true 
        AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
        AND (stock = -1 OR stock > 0)
        AND category = ${category}
        ORDER BY points_required ASC
      `
    } else {
      rewards = await sql`
        SELECT * FROM loyalty_rewards 
        WHERE is_active = true 
        AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
        AND (stock = -1 OR stock > 0)
        ORDER BY points_required ASC
      `
    }

    // Se tiver userId, buscar pontos do usuario
    let userPoints = null
    if (userId) {
      const points = await sql`
        SELECT total_points FROM user_loyalty_points WHERE user_id = ${userId}
      `
      userPoints = points[0]?.total_points || 0
    }

    // Buscar historico de resgates do usuario
    let redemptions = []
    if (userId) {
      redemptions = await sql`
        SELECT r.*, rw.name as reward_name, rw.category
        FROM loyalty_redemptions r
        JOIN loyalty_rewards rw ON r.reward_id = rw.id
        WHERE r.user_id = ${userId}
        ORDER BY r.created_at DESC
        LIMIT 20
      `
    }

    return NextResponse.json({
      success: true,
      data: {
        rewards,
        userPoints,
        redemptions
      }
    })
  } catch (error) {
    console.error("Erro ao buscar recompensas:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Resgatar recompensa
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, rewardId } = body

    if (!userId || !rewardId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Buscar recompensa
    const rewards = await sql`
      SELECT * FROM loyalty_rewards WHERE id = ${rewardId} AND is_active = true
    `

    if (rewards.length === 0) {
      return NextResponse.json({ error: "Recompensa nao encontrada ou indisponivel" }, { status: 404 })
    }

    const reward = rewards[0]

    // Verificar estoque
    if (reward.stock !== -1 && reward.stock <= 0) {
      return NextResponse.json({ error: "Recompensa esgotada" }, { status: 400 })
    }

    // Verificar pontos do usuario
    const userPoints = await sql`
      SELECT total_points, cashback_balance FROM user_loyalty_points WHERE user_id = ${userId}
    `

    if (userPoints.length === 0 || userPoints[0].total_points < reward.points_required) {
      return NextResponse.json({ 
        error: "Pontos insuficientes",
        required: reward.points_required,
        available: userPoints[0]?.total_points || 0
      }, { status: 400 })
    }

    // Gerar codigo de resgate
    const redemptionCode = `FIT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Criar resgate
    await sql`
      INSERT INTO loyalty_redemptions (user_id, reward_id, points_spent, redemption_code, status)
      VALUES (${userId}, ${rewardId}, ${reward.points_required}, ${redemptionCode}, 'pending')
    `

    // Atualizar pontos do usuario
    const newBalance = userPoints[0].total_points - reward.points_required
    
    // Se a recompensa tem cashback, adicionar ao saldo
    let newCashback = userPoints[0].cashback_balance
    if (reward.cashback_value > 0) {
      newCashback += parseFloat(reward.cashback_value)
    }

    await sql`
      UPDATE user_loyalty_points 
      SET 
        total_points = ${newBalance},
        cashback_balance = ${newCashback},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    // Registrar transacao
    await sql`
      INSERT INTO loyalty_transactions (user_id, transaction_type, points, description, reference_type, reference_id, balance_after)
      VALUES (${userId}, 'redeem', ${-reward.points_required}, ${'Resgate: ' + reward.name}, 'reward', ${rewardId.toString()}, ${newBalance})
    `

    // Atualizar estoque se aplicavel
    if (reward.stock !== -1) {
      await sql`
        UPDATE loyalty_rewards SET stock = stock - 1 WHERE id = ${rewardId}
      `
    }

    return NextResponse.json({
      success: true,
      data: {
        redemptionCode,
        reward: reward.name,
        pointsSpent: reward.points_required,
        cashbackAdded: reward.cashback_value,
        newBalance,
        newCashback
      }
    })
  } catch (error) {
    console.error("Erro ao resgatar recompensa:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
