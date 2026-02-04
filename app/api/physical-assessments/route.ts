import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId obrigatorio" }, { status: 400 })
    }

    const assessments = await sql`
      SELECT * FROM physical_assessments 
      WHERE user_id = ${userId} 
      ORDER BY assessment_date DESC
    `

    return NextResponse.json({ success: true, data: assessments })
  } catch (error) {
    console.error("Erro ao buscar avaliacoes:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar avaliacoes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      assessorId,
      assessmentDate,
      // Dados Basicos
      height, weight, bodyFatPercentage, muscleMass, boneMass, waterPercentage,
      metabolicAge, basalMetabolicRate,
      // Circunferencias
      neck, shoulders, chest, waist, hips,
      leftArm, rightArm, leftForearm, rightForearm,
      leftThigh, rightThigh, leftCalf, rightCalf,
      // Dobras Cutaneas
      tricepsFold, bicepsFold, subscapularFold, suprailiacFold,
      abdominalFold, thighFold, calfFold,
      // Testes Fisicos
      flexibilityTest, pushUpsCount, sitUpsCount, plankTime, vo2Max, restingHeartRate,
      // Anamnese
      healthConditions, injuries, medications, allergies, goals,
      activityLevel, sleepQuality, stressLevel,
      // Fotos
      photoFront, photoSide, photoBack,
      notes
    } = body

    const result = await sql`
      INSERT INTO physical_assessments (
        user_id, assessor_id, assessment_date,
        height, weight, body_fat_percentage, muscle_mass, bone_mass, water_percentage,
        metabolic_age, basal_metabolic_rate,
        neck, shoulders, chest, waist, hips,
        left_arm, right_arm, left_forearm, right_forearm,
        left_thigh, right_thigh, left_calf, right_calf,
        triceps_fold, biceps_fold, subscapular_fold, suprailiac_fold,
        abdominal_fold, thigh_fold, calf_fold,
        flexibility_test, push_ups_count, sit_ups_count, plank_time, vo2_max, resting_heart_rate,
        health_conditions, injuries, medications, allergies, goals,
        activity_level, sleep_quality, stress_level,
        photo_front, photo_side, photo_back,
        notes
      ) VALUES (
        ${userId}, ${assessorId}, ${assessmentDate || new Date().toISOString().split('T')[0]},
        ${height}, ${weight}, ${bodyFatPercentage}, ${muscleMass}, ${boneMass}, ${waterPercentage},
        ${metabolicAge}, ${basalMetabolicRate},
        ${neck}, ${shoulders}, ${chest}, ${waist}, ${hips},
        ${leftArm}, ${rightArm}, ${leftForearm}, ${rightForearm},
        ${leftThigh}, ${rightThigh}, ${leftCalf}, ${rightCalf},
        ${tricepsFold}, ${bicepsFold}, ${subscapularFold}, ${suprailiacFold},
        ${abdominalFold}, ${thighFold}, ${calfFold},
        ${flexibilityTest}, ${pushUpsCount}, ${sitUpsCount}, ${plankTime}, ${vo2Max}, ${restingHeartRate},
        ${healthConditions || []}, ${injuries || []}, ${medications || []}, ${allergies || []}, ${goals || []},
        ${activityLevel}, ${sleepQuality}, ${stressLevel},
        ${photoFront}, ${photoSide}, ${photoBack},
        ${notes}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Erro ao criar avaliacao:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar avaliacao" }, { status: 500 })
  }
}
