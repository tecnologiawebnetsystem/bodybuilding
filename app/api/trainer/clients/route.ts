import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trainerId = searchParams.get("trainerId")

    if (!trainerId) {
      return NextResponse.json({ error: "Trainer ID required" }, { status: 400 })
    }

    const clients = await sql`
      SELECT 
        u.user_id,
        u.pin,
        u.name,
        u.age,
        u.gender,
        u.height,
        u.current_weight,
        u.initial_weight,
        u.target_weight,
        u.partner_gym_id,
        u.subscription_status,
        u.subscription_plan_id,
        u.personal_trainer_id,
        u.created_at,
        tc.status as client_status,
        tc.started_at,
        COUNT(DISTINCT wc.id) as total_workouts,
        MAX(wc.created_at) as last_workout_date
      FROM trainer_clients tc
      JOIN users u ON tc.client_user_id = u.user_id
      LEFT JOIN workout_checkins wc ON u.user_id = wc.user_id
      WHERE tc.trainer_id = ${trainerId} AND tc.status = 'active'
      GROUP BY 
        u.user_id, u.pin, u.name, u.age, u.gender, u.height, 
        u.current_weight, u.initial_weight, u.target_weight, u.partner_gym_id,
        u.subscription_status, u.subscription_plan_id, u.personal_trainer_id, u.created_at,
        tc.status, tc.started_at
      ORDER BY tc.started_at DESC
    `

    return NextResponse.json({ clients })
  } catch (error) {
    console.error("Error fetching trainer clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Gerar user_id unico
    const user_id = data.name.toLowerCase().replace(/\s+/g, "_").substring(0, 20) + "_" + Date.now().toString().slice(-6)
    
    // Usar PIN fornecido ou gerar aleatorio de 6 digitos
    const pin = data.pin && data.pin.length === 6 ? data.pin : Math.floor(100000 + Math.random() * 900000).toString()

    // Criar usuario
    await sql`
      INSERT INTO users (
        user_id, name, cpf, email, pin, role,
        age, gender, height, initial_weight, target_weight, current_weight,
        personal_trainer_id, start_date
      ) VALUES (
        ${user_id},
        ${data.name},
        ${data.cpf || '000.000.000-00'},
        ${data.email || null},
        ${pin},
        'student',
        ${data.age || 25},
        ${data.gender || 'Masculino'},
        ${data.height || 170},
        ${data.currentWeight || 70},
        ${data.targetWeight || 70},
        ${data.currentWeight || 70},
        ${data.trainerId},
        CURRENT_DATE
      )
    `

    // Criar relacao trainer-client
    await sql`
      INSERT INTO trainer_clients (trainer_id, client_user_id, status, monthly_fee)
      VALUES (${data.trainerId}, ${user_id}, 'active', ${data.monthlyFee || 350})
    `

    // Salvar preferencias do aluno
    await sql`
      INSERT INTO user_preferences (
        user_id,
        enable_calisthenics,
        enable_running,
        enable_supplements,
        enable_nutrition,
        enable_home_workouts,
        gym_frequency,
        preferred_split,
        session_duration,
        primary_goal,
        training_experience
      ) VALUES (
        ${user_id},
        ${data.includeHomeWorkouts || false},
        ${data.includeRunning || false},
        ${data.includeSupplements || false},
        ${data.includeNutrition || false},
        ${data.includeHomeWorkouts || false},
        ${data.gymFrequency || 4},
        ${data.preferredSplit || 'abc'},
        ${data.sessionDuration || 60},
        ${data.primaryGoal || 'gain_muscle'},
        ${data.trainingExperience || 'beginner'}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        enable_calisthenics = EXCLUDED.enable_calisthenics,
        enable_running = EXCLUDED.enable_running,
        enable_supplements = EXCLUDED.enable_supplements,
        enable_nutrition = EXCLUDED.enable_nutrition,
        enable_home_workouts = EXCLUDED.enable_home_workouts,
        gym_frequency = EXCLUDED.gym_frequency,
        preferred_split = EXCLUDED.preferred_split,
        session_duration = EXCLUDED.session_duration,
        primary_goal = EXCLUDED.primary_goal,
        training_experience = EXCLUDED.training_experience
    `

    // Salvar suplementos se houver
    if (data.includeSupplements && data.supplements?.length > 0) {
      for (const supp of data.supplements) {
        await sql`
          INSERT INTO user_supplements (user_id, supplement_name, active)
          VALUES (${user_id}, ${supp}, true)
        `
      }
    }

    return NextResponse.json({ 
      success: true, 
      user_id, 
      pin,
      message: "Aluno cadastrado com sucesso! PIN: " + pin
    })
  } catch (error: any) {
    console.error("Error adding client:", error)
    return NextResponse.json({ error: "Failed to add client", message: error.message }, { status: 500 })
  }
}
