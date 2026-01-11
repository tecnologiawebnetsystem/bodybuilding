import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 })
    }

    const subscription = await sql`
      SELECT 
        us.*,
        sp.plan_name,
        sp.features,
        sp.price_monthly,
        sp.price_yearly
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.plan_id
      WHERE us.user_id = ${userId}
      AND us.status = 'active'
      ORDER BY us.created_at DESC
      LIMIT 1
    `

    return Response.json({ subscription: subscription[0] || null })
  } catch (error) {
    console.error("[v0] Error fetching subscription:", error)
    return Response.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, planId, billingCycle, paymentMethod } = await request.json()

    // Calcular next_billing_date
    const nextBilling = new Date()
    if (billingCycle === "yearly") {
      nextBilling.setFullYear(nextBilling.getFullYear() + 1)
    } else {
      nextBilling.setMonth(nextBilling.getMonth() + 1)
    }

    // Criar assinatura
    const result = await sql`
      INSERT INTO user_subscriptions (
        user_id, plan_id, billing_cycle, payment_method, next_billing_date
      ) VALUES (
        ${userId}, ${planId}, ${billingCycle}, ${paymentMethod}, ${nextBilling.toISOString()}
      )
      RETURNING *
    `

    // Atualizar status na tabela users
    await sql`
      UPDATE users 
      SET subscription_status = 'active',
          subscription_plan_id = ${planId}
      WHERE user_id = ${userId}
    `

    return Response.json({ subscription: result[0] })
  } catch (error) {
    console.error("[v0] Error creating subscription:", error)
    return Response.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
