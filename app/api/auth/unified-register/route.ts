import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"

// Registro unificado para todos os tipos de usuario
// Suporta: gym_owner, trainer, student (independente)

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const body = await request.json()
    
    const { 
      name, 
      email, 
      cpf,
      phone,
      password,
      accountType, // 'gym_owner', 'trainer', 'student'
      // Campos especificos para cada tipo
      gymData, // { gymName, cnpj, address, city, state, zipCode }
      trainerData, // { cref, specialties, bio }
      studentData, // { age, gender, height, weight, goal }
    } = body

    // Validacoes basicas
    if (!name || !email || !password || !accountType) {
      return NextResponse.json({ error: "Campos obrigatorios faltando" }, { status: 400 })
    }

    if (!['gym_owner', 'trainer', 'student'].includes(accountType)) {
      return NextResponse.json({ error: "Tipo de conta invalido" }, { status: 400 })
    }

    // Verificar se email ja existe
    const existingUser = await sql`
      SELECT user_id FROM users WHERE email = ${email}
    `
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email ja cadastrado" }, { status: 409 })
    }

    // Verificar se CPF ja existe (se fornecido)
    if (cpf) {
      const existingCpf = await sql`
        SELECT user_id FROM users WHERE cpf = ${cpf}
      `
      if (existingCpf.length > 0) {
        return NextResponse.json({ error: "CPF ja cadastrado" }, { status: 409 })
      }
    }

    // Gerar IDs e senhas
    const userId = nanoid(12)
    const hashedPassword = await bcrypt.hash(password, 12)
    const pin = Math.floor(100000 + Math.random() * 900000).toString()
    const referralCode = nanoid(8).toUpperCase()

    // Criar usuario base
    await sql`
      INSERT INTO users (
        user_id, name, email, cpf, phone, password, pin, 
        role, account_type, is_independent, referral_code,
        email_verified, profile_complete, onboarding_step, created_at
      ) VALUES (
        ${userId}, ${name}, ${email}, ${cpf || null}, ${phone || null}, 
        ${hashedPassword}, ${pin}, ${accountType}, ${accountType}, 
        ${accountType === 'student'}, ${referralCode},
        false, false, 0, NOW()
      )
    `

    // Processar dados especificos por tipo
    let gymId = null
    let subscriptionId = null
    let trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14) // 14 dias de trial

    if (accountType === 'gym_owner' && gymData) {
      // Criar academia
      const gymResult = await sql`
        INSERT INTO gyms (
          gym_name, cnpj, address, city, state, zip_code, email, phone,
          owner_user_id, is_active, trial_ends_at, created_at
        ) VALUES (
          ${gymData.gymName}, ${gymData.cnpj || null}, ${gymData.address || null},
          ${gymData.city || null}, ${gymData.state || null}, ${gymData.zipCode || null},
          ${email}, ${phone || null}, ${userId}, true, ${trialEndsAt.toISOString()}, NOW()
        ) RETURNING id
      `
      gymId = gymResult[0].id

      // Criar assinatura trial para academia
      const subResult = await sql`
        INSERT INTO saas_subscriptions (
          subscriber_type, subscriber_id, plan_id, status,
          trial_ends_at, current_period_start, current_period_end, created_at
        ) VALUES (
          'gym', ${gymId.toString()}, 1, 'trial',
          ${trialEndsAt.toISOString()}, NOW(), ${trialEndsAt.toISOString()}, NOW()
        ) RETURNING id
      `
      subscriptionId = subResult[0].id

      // Atualizar academia com subscription_id
      await sql`UPDATE gyms SET subscription_id = ${subscriptionId} WHERE id = ${gymId}`
    }

    if (accountType === 'trainer') {
      // Criar perfil de trainer
      await sql`
        INSERT INTO trainer_profiles_new (
          user_id, bio, specialties, certifications, experience_years,
          is_active, trial_ends_at, created_at
        ) VALUES (
          ${userId}, ${trainerData?.bio || null}, 
          ${JSON.stringify(trainerData?.specialties || [])},
          ${JSON.stringify([trainerData?.cref ? { type: 'CREF', number: trainerData.cref } : null].filter(Boolean))},
          ${trainerData?.experienceYears || 0},
          true, ${trialEndsAt.toISOString()}, NOW()
        )
      `

      // Criar assinatura trial para trainer
      const subResult = await sql`
        INSERT INTO saas_subscriptions (
          subscriber_type, subscriber_id, plan_id, status,
          trial_ends_at, current_period_start, current_period_end, created_at
        ) VALUES (
          'trainer', ${userId}, 4, 'trial',
          ${trialEndsAt.toISOString()}, NOW(), ${trialEndsAt.toISOString()}, NOW()
        ) RETURNING id
      `
      subscriptionId = subResult[0].id

      // Atualizar perfil com subscription_id
      await sql`UPDATE trainer_profiles_new SET subscription_id = ${subscriptionId} WHERE user_id = ${userId}`
    }

    if (accountType === 'student') {
      // Criar perfil de aluno independente
      await sql`
        INSERT INTO independent_students (
          user_id, subscription_status, features_enabled, created_at
        ) VALUES (
          ${userId}, 'free', '["basic_workouts", "progress_tracking"]', NOW()
        )
      `

      // Atualizar dados fisicos se fornecidos
      if (studentData) {
        await sql`
          UPDATE users SET
            age = ${studentData.age || null},
            gender = ${studentData.gender || null},
            height = ${studentData.height || null},
            current_weight = ${studentData.weight || null},
            initial_weight = ${studentData.weight || null},
            target_weight = ${studentData.targetWeight || studentData.weight || null}
          WHERE user_id = ${userId}
        `
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        userId,
        name,
        email,
        accountType,
        pin,
        referralCode,
      },
      gymId,
      subscriptionId,
      trialEndsAt: trialEndsAt.toISOString(),
      message: `Conta criada com sucesso! ${accountType === 'gym_owner' ? 'Sua academia foi cadastrada.' : accountType === 'trainer' ? 'Seu perfil de personal trainer foi criado.' : 'Seu perfil de aluno foi criado.'}`,
    })
  } catch (error) {
    console.error("[Auth] Register error:", error)
    return NextResponse.json({ error: "Erro ao criar conta", details: String(error) }, { status: 500 })
  }
}
