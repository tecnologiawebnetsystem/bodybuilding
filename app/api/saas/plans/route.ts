import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// API para gerenciar planos SaaS

// GET - Listar planos
export async function GET(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const { searchParams } = new URL(request.url)
    
    const targetRole = searchParams.get("role") // 'gym_owner', 'trainer', 'student'
    const activeOnly = searchParams.get("active") !== "false"

    let plans
    if (targetRole) {
      plans = await sql`
        SELECT * FROM saas_plans_new 
        WHERE target_role = ${targetRole} 
        ${activeOnly ? sql`AND is_active = true` : sql``}
        ORDER BY price_monthly ASC
      `
    } else {
      plans = await sql`
        SELECT * FROM saas_plans_new 
        ${activeOnly ? sql`WHERE is_active = true` : sql``}
        ORDER BY target_role, price_monthly ASC
      `
    }

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("[SaaS Plans] GET error:", error)
    return NextResponse.json({ error: "Erro ao buscar planos" }, { status: 500 })
  }
}

// POST - Criar novo plano (apenas super admin)
export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const body = await request.json()
    
    const {
      code,
      name,
      description,
      targetRole,
      priceMonthly,
      priceYearly,
      maxStudents,
      maxTrainers,
      features,
      trialDays
    } = body

    // Verificar se codigo ja existe
    const existing = await sql`SELECT id FROM saas_plans_new WHERE code = ${code}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Codigo de plano ja existe" }, { status: 409 })
    }

    const result = await sql`
      INSERT INTO saas_plans_new (
        code, name, description, target_role, price_monthly, price_yearly,
        max_students, max_trainers, features, trial_days, is_active, created_at
      ) VALUES (
        ${code}, ${name}, ${description || null}, ${targetRole},
        ${priceMonthly}, ${priceYearly || null}, ${maxStudents || null},
        ${maxTrainers || null}, ${JSON.stringify(features || [])},
        ${trialDays || 7}, true, NOW()
      ) RETURNING *
    `

    return NextResponse.json({ success: true, plan: result[0] })
  } catch (error) {
    console.error("[SaaS Plans] POST error:", error)
    return NextResponse.json({ error: "Erro ao criar plano" }, { status: 500 })
  }
}

// PUT - Atualizar plano
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
      name,
      description,
      priceMonthly,
      priceYearly,
      maxStudents,
      maxTrainers,
      features,
      trialDays,
      isActive
    } = body

    await sql`
      UPDATE saas_plans_new SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        price_monthly = COALESCE(${priceMonthly}, price_monthly),
        price_yearly = COALESCE(${priceYearly}, price_yearly),
        max_students = COALESCE(${maxStudents}, max_students),
        max_trainers = COALESCE(${maxTrainers}, max_trainers),
        features = COALESCE(${features ? JSON.stringify(features) : null}, features),
        trial_days = COALESCE(${trialDays}, trial_days),
        is_active = COALESCE(${isActive}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[SaaS Plans] PUT error:", error)
    return NextResponse.json({ error: "Erro ao atualizar plano" }, { status: 500 })
  }
}
