import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// API para gerenciar assinaturas SaaS

// GET - Buscar assinaturas
export async function GET(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const { searchParams } = new URL(request.url)
    
    const subscriberType = searchParams.get("type") // 'gym', 'trainer', 'student'
    const subscriberId = searchParams.get("subscriberId")
    const status = searchParams.get("status")

    // Buscar assinatura especifica
    if (subscriberType && subscriberId) {
      const subscriptions = await sql`
        SELECT 
          s.*,
          p.code as plan_code,
          p.name as plan_name,
          p.features,
          p.max_students,
          p.max_trainers
        FROM saas_subscriptions s
        LEFT JOIN saas_plans_new p ON p.id = s.plan_id
        WHERE s.subscriber_type = ${subscriberType} 
        AND s.subscriber_id = ${subscriberId}
        ORDER BY s.created_at DESC
      `
      return NextResponse.json({ subscriptions })
    }

    // Buscar todas (admin)
    let query
    if (status) {
      query = await sql`
        SELECT 
          s.*,
          p.code as plan_code,
          p.name as plan_name,
          p.price_monthly
        FROM saas_subscriptions s
        LEFT JOIN saas_plans_new p ON p.id = s.plan_id
        WHERE s.status = ${status}
        ORDER BY s.created_at DESC
      `
    } else {
      query = await sql`
        SELECT 
          s.*,
          p.code as plan_code,
          p.name as plan_name,
          p.price_monthly
        FROM saas_subscriptions s
        LEFT JOIN saas_plans_new p ON p.id = s.plan_id
        ORDER BY s.created_at DESC
      `
    }

    return NextResponse.json({ subscriptions: query })
  } catch (error) {
    console.error("[SaaS Subscriptions] GET error:", error)
    return NextResponse.json({ error: "Erro ao buscar assinaturas" }, { status: 500 })
  }
}

// POST - Criar ou upgrade de assinatura
export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const body = await request.json()
    
    const {
      subscriberType, // 'gym', 'trainer', 'student'
      subscriberId,
      planId,
      paymentMethod,
      startTrial
    } = body

    // Buscar plano
    const plans = await sql`SELECT * FROM saas_plans_new WHERE id = ${planId}`
    if (plans.length === 0) {
      return NextResponse.json({ error: "Plano nao encontrado" }, { status: 404 })
    }
    const plan = plans[0]

    // Cancelar assinaturas anteriores ativas
    await sql`
      UPDATE saas_subscriptions 
      SET status = 'cancelled', cancel_at_period_end = false, updated_at = NOW()
      WHERE subscriber_type = ${subscriberType} 
      AND subscriber_id = ${subscriberId}
      AND status IN ('active', 'trial')
    `

    // Calcular datas
    const now = new Date()
    let status = 'active'
    let trialEndsAt = null
    let periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    if (startTrial && plan.trial_days > 0) {
      status = 'trial'
      trialEndsAt = new Date(now)
      trialEndsAt.setDate(trialEndsAt.getDate() + plan.trial_days)
      periodEnd = trialEndsAt
    }

    // Criar nova assinatura
    const result = await sql`
      INSERT INTO saas_subscriptions (
        subscriber_type, subscriber_id, plan_id, status,
        trial_ends_at, current_period_start, current_period_end,
        payment_method, created_at
      ) VALUES (
        ${subscriberType}, ${subscriberId}, ${planId}, ${status},
        ${trialEndsAt?.toISOString() || null}, ${now.toISOString()},
        ${periodEnd.toISOString()}, ${paymentMethod || null}, NOW()
      ) RETURNING *
    `

    // Atualizar referencia na tabela correspondente
    if (subscriberType === 'gym') {
      await sql`UPDATE gyms SET subscription_id = ${result[0].id} WHERE id = ${parseInt(subscriberId)}`
    } else if (subscriberType === 'trainer') {
      await sql`UPDATE trainer_profiles_new SET subscription_id = ${result[0].id} WHERE user_id = ${subscriberId}`
    } else if (subscriberType === 'student') {
      await sql`UPDATE independent_students SET subscription_id = ${result[0].id} WHERE user_id = ${subscriberId}`
    }

    return NextResponse.json({ 
      success: true, 
      subscription: result[0],
      plan,
      message: status === 'trial' 
        ? `Trial iniciado! Voce tem ${plan.trial_days} dias para testar.`
        : 'Assinatura ativada com sucesso!'
    })
  } catch (error) {
    console.error("[SaaS Subscriptions] POST error:", error)
    return NextResponse.json({ error: "Erro ao criar assinatura" }, { status: 500 })
  }
}

// PUT - Atualizar assinatura (cancelar, renovar, etc)
export async function PUT(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const body = await request.json()
    
    const {
      id,
      action, // 'cancel', 'renew', 'upgrade', 'activate'
      newPlanId,
      paymentMethod
    } = body

    if (action === 'cancel') {
      // Cancelar ao fim do periodo
      await sql`
        UPDATE saas_subscriptions 
        SET cancel_at_period_end = true, updated_at = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ success: true, message: 'Assinatura sera cancelada ao fim do periodo' })
    }

    if (action === 'activate') {
      // Ativar assinatura (converter trial ou reativar)
      const periodEnd = new Date()
      periodEnd.setMonth(periodEnd.getMonth() + 1)
      
      await sql`
        UPDATE saas_subscriptions 
        SET 
          status = 'active',
          current_period_start = NOW(),
          current_period_end = ${periodEnd.toISOString()},
          payment_method = COALESCE(${paymentMethod}, payment_method),
          updated_at = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ success: true, message: 'Assinatura ativada!' })
    }

    if (action === 'upgrade' && newPlanId) {
      // Upgrade de plano
      const plans = await sql`SELECT * FROM saas_plans_new WHERE id = ${newPlanId}`
      if (plans.length === 0) {
        return NextResponse.json({ error: "Plano nao encontrado" }, { status: 404 })
      }
      
      await sql`
        UPDATE saas_subscriptions 
        SET plan_id = ${newPlanId}, updated_at = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ success: true, message: 'Plano atualizado!', plan: plans[0] })
    }

    return NextResponse.json({ error: "Acao invalida" }, { status: 400 })
  } catch (error) {
    console.error("[SaaS Subscriptions] PUT error:", error)
    return NextResponse.json({ error: "Erro ao atualizar assinatura" }, { status: 500 })
  }
}
