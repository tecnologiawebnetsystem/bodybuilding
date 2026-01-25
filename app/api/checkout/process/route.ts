import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const body = await request.json()

    const {
      planId,
      billing, // 'monthly' or 'yearly'
      paymentMethod, // 'credit_card', 'pix', 'boleto'
      name,
      email,
      cpf,
      phone,
      // Dados do cartao (se aplicavel)
      cardNumber,
      cardExpiry,
      cardCvv,
      cardName,
    } = body

    // Validacoes basicas
    if (!planId || !billing || !paymentMethod || !name || !email || !cpf) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Buscar plano
    const planResult = await sql`
      SELECT * FROM pricing_plans WHERE code = ${planId} AND is_active = true
    `

    if (planResult.length === 0) {
      return NextResponse.json({ error: "Plano nao encontrado" }, { status: 404 })
    }

    const plan = planResult[0]
    const price = billing === 'yearly' ? plan.price_yearly : plan.price_monthly

    // Calcular desconto PIX
    let finalPrice = price
    let discount = 0
    if (paymentMethod === 'pix') {
      discount = price * 0.05 // 5% desconto
      finalPrice = price - discount
    }

    // Gerar ID unico para o usuario
    const userId = `user_${uuidv4().split('-')[0]}`
    const pin = String(Math.floor(100000 + Math.random() * 900000)) // PIN de 6 digitos

    // Determinar role baseado no plano
    let role = 'student'
    let accountType = 'student'
    if (plan.target_role === 'gym_owner') {
      role = 'gym_owner'
      accountType = 'gym_owner'
    } else if (plan.target_role === 'trainer') {
      role = 'trainer'
      accountType = 'trainer'
    }

    // Criar usuario
    await sql`
      INSERT INTO users (
        user_id, name, email, pin, role, account_type,
        age, gender, height, initial_weight, target_weight, current_weight,
        start_date, email_verified, profile_complete, is_independent, created_at
      ) VALUES (
        ${userId}, ${name}, ${email}, ${pin}, ${role}, ${accountType},
        25, 'Nao informado', 170, 70, 70, 70,
        CURRENT_DATE, false, false, ${accountType === 'student'}, NOW()
      )
    `

    // Calcular periodo da assinatura
    const now = new Date()
    const periodEnd = new Date(now)
    if (billing === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    // Criar assinatura
    const subscriptionResult = await sql`
      INSERT INTO saas_subscriptions (
        subscriber_type, subscriber_id, plan_id, status,
        current_period_start, current_period_end, payment_method, created_at
      ) VALUES (
        ${plan.target_role}, ${userId}, ${plan.id}, 'active',
        ${now.toISOString()}, ${periodEnd.toISOString()}, ${paymentMethod}, NOW()
      )
      RETURNING id
    `

    const subscriptionId = subscriptionResult[0].id

    // Registrar pagamento
    await sql`
      INSERT INTO saas_payment_history (
        subscription_id, amount, currency, status, payment_method,
        description, paid_at, created_at
      ) VALUES (
        ${subscriptionId}, ${finalPrice}, 'BRL', 'paid', ${paymentMethod},
        ${`Assinatura ${plan.name} - ${billing === 'yearly' ? 'Anual' : 'Mensal'}`},
        NOW(), NOW()
      )
    `

    // Se for academia, criar registro na tabela gyms
    if (accountType === 'gym_owner') {
      await sql`
        INSERT INTO gyms (name, owner_user_id, subscription_id, created_at)
        VALUES (${name + ' Academia'}, ${userId}, ${subscriptionId}, NOW())
      `
    }

    // Se for trainer, criar perfil de trainer
    if (accountType === 'trainer') {
      await sql`
        INSERT INTO trainer_profiles_new (user_id, subscription_id, is_independent, created_at)
        VALUES (${userId}, ${subscriptionId}, true, NOW())
      `
    }

    // Se for aluno independente
    if (accountType === 'student') {
      await sql`
        INSERT INTO independent_students (user_id, subscription_id, subscription_status, created_at)
        VALUES (${userId}, ${subscriptionId}, 'premium', NOW())
      `
    }

    // Gerar dados de retorno baseado no metodo de pagamento
    let paymentData: any = {
      status: 'approved',
      method: paymentMethod,
    }

    if (paymentMethod === 'pix') {
      // Gerar QR Code PIX (simulado)
      paymentData = {
        ...paymentData,
        pixCode: `00020126580014br.gov.bcb.pix0136${uuidv4()}5204000053039865404${finalPrice.toFixed(2)}5802BR5913FitTransform6009SAO PAULO62070503***6304`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      }
    } else if (paymentMethod === 'boleto') {
      // Gerar boleto (simulado)
      paymentData = {
        ...paymentData,
        boletoCode: `23793.38128 60000.000003 00000.000400 1 ${String(Date.now()).slice(-14)}`,
        boletoUrl: '#',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias
      }
    }

    return NextResponse.json({
      success: true,
      message: "Assinatura criada com sucesso!",
      data: {
        userId,
        email,
        pin, // Mostrar o PIN para o usuario
        plan: plan.name,
        billing,
        amount: finalPrice,
        discount,
        subscriptionId,
        periodStart: now.toISOString(),
        periodEnd: periodEnd.toISOString(),
        payment: paymentData,
      }
    })

  } catch (error) {
    console.error("Erro ao processar checkout:", error)
    return NextResponse.json({ 
      error: "Erro ao processar pagamento", 
      details: String(error) 
    }, { status: 500 })
  }
}
