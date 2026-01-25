import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const data = await request.json()

    const {
      email,
      accountType,
      phone,
      birthDate,
      gender,
      height,
      weight,
      targetWeight,
      fitnessGoal,
      experienceLevel,
      gymName,
      gymAddress,
      gymCity,
      gymState,
      gymPhone,
      gymDescription,
      specializations,
      certifications,
      bio,
      pricePerHour,
    } = data

    // Buscar usuario pelo email
    const users = await sql`
      SELECT user_id FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = users[0].user_id

    // Atualizar dados do usuario
    await sql`
      UPDATE users SET
        phone = ${phone || null},
        gender = ${gender || null},
        height = ${height ? Number(height) : null},
        initial_weight = ${weight ? Number(weight) : null},
        current_weight = ${weight ? Number(weight) : null},
        target_weight = ${targetWeight ? Number(targetWeight) : null},
        fitness_goal = ${fitnessGoal || null},
        profile_complete = true,
        onboarding_step = 99,
        updated_at = NOW()
      WHERE user_id = ${userId}
    `

    // Se for dono de academia, criar/atualizar academia
    if (accountType === 'gym_owner' && gymName) {
      // Verificar se ja tem academia vinculada
      const existingGyms = await sql`
        SELECT id FROM gyms WHERE owner_user_id = ${userId}
      `

      if (existingGyms.length > 0) {
        // Atualizar academia existente
        await sql`
          UPDATE gyms SET
            name = ${gymName},
            address = ${gymAddress || null},
            city = ${gymCity || null},
            state = ${gymState || null},
            phone = ${gymPhone || null},
            description = ${gymDescription || null},
            updated_at = NOW()
          WHERE owner_user_id = ${userId}
        `
      } else {
        // Criar nova academia
        await sql`
          INSERT INTO gyms (
            name, address, city, state, phone, description, 
            owner_user_id, created_at
          ) VALUES (
            ${gymName}, ${gymAddress || null}, ${gymCity || null}, 
            ${gymState || null}, ${gymPhone || null}, ${gymDescription || null},
            ${userId}, NOW()
          )
        `
      }
    }

    // Se for trainer, atualizar perfil de trainer
    if (accountType === 'trainer') {
      // Verificar se ja tem perfil de trainer
      const existingProfile = await sql`
        SELECT id FROM trainer_profiles_new WHERE user_id = ${userId}
      `

      if (existingProfile.length > 0) {
        await sql`
          UPDATE trainer_profiles_new SET
            specializations = ${JSON.stringify(specializations || [])},
            certifications = ${certifications || null},
            bio = ${bio || null},
            price_per_hour = ${pricePerHour ? Number(pricePerHour) : null},
            updated_at = NOW()
          WHERE user_id = ${userId}
        `
      } else {
        await sql`
          INSERT INTO trainer_profiles_new (
            user_id, specializations, certifications, bio, 
            price_per_hour, is_available, created_at
          ) VALUES (
            ${userId}, ${JSON.stringify(specializations || [])}, 
            ${certifications || null}, ${bio || null},
            ${pricePerHour ? Number(pricePerHour) : null}, true, NOW()
          )
        `
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "Onboarding completed successfully" 
    })

  } catch (error) {
    console.error("Error completing onboarding:", error)
    return NextResponse.json({ 
      error: "Failed to complete onboarding",
      details: String(error)
    }, { status: 500 })
  }
}
