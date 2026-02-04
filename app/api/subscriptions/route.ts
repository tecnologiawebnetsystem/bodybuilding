import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Buscar planos e assinaturas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const gymUnitId = searchParams.get("gymUnitId")

    // Buscar assinatura do usuario
    if (userId) {
      const subscription = await sql`
        SELECT us.*, sp.name as plan_name, sp.features, gu.name as gym_name
        FROM user_subscriptions us
        LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
        LEFT JOIN gym_units gu ON us.gym_unit_id = gu.id
        WHERE us.user_id = ${userId} AND us.status = 'active'
        ORDER BY us.created_at DESC
        LIMIT 1
      `

      const paymentHistory = await sql`
        SELECT * FROM payment_history
        WHERE user_id = ${userId}
        ORDER BY paid_at DESC
        LIMIT 10
      `

      return NextResponse.json({
        success: true,
        data: {
          subscription: subscription[0] || null,
          paymentHistory
        }
      })
    }

    // Buscar planos disponiveis de uma unidade
    if (gymUnitId) {
      const plans = await sql`
        SELECT * FROM subscription_plans
        WHERE gym_unit_id = ${gymUnitId} AND is_active = true
        ORDER BY price_monthly ASC
      `

      return NextResponse.json({ success: true, data: plans })
    }

    return NextResponse.json({ success: false, error: "Parametros invalidos" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao buscar assinaturas:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar dados" }, { status: 500 })
  }
}

// POST - Criar plano ou assinatura
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === "create_plan") {
      const {
        gymUnitId, name, description, priceMonthly, priceQuarterly, priceYearly,
        features, stripePriceIdMonthly, stripePriceIdQuarterly, stripePriceIdYearly
      } = body

      const result = await sql`
        INSERT INTO subscription_plans (
          gym_unit_id, name, description, price_monthly, price_quarterly, price_yearly,
          features, stripe_price_id_monthly, stripe_price_id_quarterly, stripe_price_id_yearly
        ) VALUES (
          ${gymUnitId}, ${name}, ${description}, ${priceMonthly}, ${priceQuarterly}, ${priceYearly},
          ${features || []}, ${stripePriceIdMonthly}, ${stripePriceIdQuarterly}, ${stripePriceIdYearly}
        )
        RETURNING *
      `

      return NextResponse.json({ success: true, data: result[0] })
    }

    if (action === "subscribe") {
      const {
        userId, planId, gymUnitId, billingCycle, stripeSubscriptionId, stripeCustomerId, amount
      } = body

      // Calcular datas
      const startDate = new Date()
      let endDate = new Date()
      
      if (billingCycle === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1)
      } else if (billingCycle === "quarterly") {
        endDate.setMonth(endDate.getMonth() + 3)
      } else if (billingCycle === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1)
      }

      const result = await sql`
        INSERT INTO user_subscriptions (
          user_id, plan_id, gym_unit_id, billing_cycle,
          stripe_subscription_id, stripe_customer_id,
          start_date, end_date, next_billing_date, amount, status
        ) VALUES (
          ${userId}, ${planId}, ${gymUnitId}, ${billingCycle},
          ${stripeSubscriptionId}, ${stripeCustomerId},
          ${startDate.toISOString()}, ${endDate.toISOString()}, ${endDate.toISOString()},
          ${amount}, 'active'
        )
        RETURNING *
      `

      // Registrar pagamento
      await sql`
        INSERT INTO payment_history (user_id, subscription_id, amount, status, description)
        VALUES (${userId}, ${result[0].id}, ${amount}, 'succeeded', 'Primeira mensalidade')
      `

      return NextResponse.json({ success: true, data: result[0] })
    }

    return NextResponse.json({ success: false, error: "Acao invalida" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao criar:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar" }, { status: 500 })
  }
}

// PUT - Atualizar assinatura (cancelar, reativar)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscriptionId, status } = body

    await sql`
      UPDATE user_subscriptions
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${subscriptionId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar:", error)
    return NextResponse.json({ success: false, error: "Erro ao atualizar" }, { status: 500 })
  }
}
