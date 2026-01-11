import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, ...onboardingData } = body

    // Atualizar dados básicos do usuário
    await sql`
      UPDATE users 
      SET 
        weight = ${onboardingData.weight},
        height = ${onboardingData.height},
        target_weight = ${onboardingData.targetWeight},
        partner_gym_id = ${onboardingData.gymId || null}
      WHERE user_id = ${userId}
    `

    // Salvar preferências de treino
    await sql`
      INSERT INTO user_training_config (
        user_id, 
        split_type, 
        training_days_per_week,
        preferred_time,
        fitness_level
      ) VALUES (
        ${userId},
        ${onboardingData.trainingDays <= 3 ? "AB" : onboardingData.trainingDays <= 4 ? "ABC" : "ABCDE"},
        ${onboardingData.trainingDays},
        ${onboardingData.preferredTime},
        ${onboardingData.fitnessLevel}
      )
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        training_days_per_week = ${onboardingData.trainingDays},
        preferred_time = ${onboardingData.preferredTime},
        fitness_level = ${onboardingData.fitnessLevel}
    `

    // Salvar configurações de cardio
    if (onboardingData.likesRunning) {
      await sql`
        INSERT INTO user_cardio_config (
          user_id,
          cardio_frequency,
          preferred_type,
          intensity_level
        ) VALUES (
          ${userId},
          ${Math.min(onboardingData.trainingDays, 3)},
          'running',
          ${onboardingData.runningLevel}
        )
        ON CONFLICT (user_id)
        DO UPDATE SET
          cardio_frequency = ${Math.min(onboardingData.trainingDays, 3)},
          preferred_type = 'running',
          intensity_level = ${onboardingData.runningLevel}
      `
    }

    // Salvar configurações de nutrição
    await sql`
      INSERT INTO user_nutrition_config (
        user_id,
        meals_per_day,
        diet_type,
        avoid_foods
      ) VALUES (
        ${userId},
        ${onboardingData.mealsPerDay},
        ${onboardingData.dietType},
        ${onboardingData.foodRestrictions?.join(", ") || ""}
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        meals_per_day = ${onboardingData.mealsPerDay},
        diet_type = ${onboardingData.dietType},
        avoid_foods = ${onboardingData.foodRestrictions?.join(", ") || ""}
    `

    // Salvar suplementos
    if (onboardingData.takesSupplements && onboardingData.currentSupplements?.length > 0) {
      for (const supplement of onboardingData.currentSupplements) {
        await sql`
          INSERT INTO user_supplement_config (user_id, supplement_name, timing, frequency)
          VALUES (${userId}, ${supplement}, 'morning', 'daily')
        `
      }
    }

    return NextResponse.json({ success: true, message: "Onboarding completed successfully" })
  } catch (error) {
    console.error("Error saving onboarding data:", error)
    return NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 })
  }
}
