import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// POST - Criar novo aluno com cadastro completo
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Gerar user_id unico
    const user_id = data.name.toLowerCase().replace(/\s+/g, "_").substring(0, 20) + "_" + Date.now().toString().slice(-6)
    
    // Usar PIN fornecido ou gerar aleatorio de 6 digitos
    const pin = data.pin && data.pin.length === 6 ? data.pin : Math.floor(100000 + Math.random() * 900000).toString()

    // Criar usuario
    await sql`
      INSERT INTO users (
        user_id, name, cpf, email, pin, role, gym_id,
        age, gender, height, initial_weight, target_weight, current_weight,
        start_date
      ) VALUES (
        ${user_id},
        ${data.name},
        ${data.cpf || '000.000.000-00'},
        ${data.email || null},
        ${pin},
        'student',
        1,
        ${data.age || 25},
        ${data.gender || 'Masculino'},
        ${data.height || 170},
        ${data.currentWeight || 70},
        ${data.targetWeight || 70},
        ${data.currentWeight || 70},
        CURRENT_DATE
      )
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

    return Response.json({ 
      success: true, 
      user_id, 
      pin,
      message: "Aluno cadastrado com sucesso! PIN: " + pin
    })
  } catch (error: any) {
    console.error("[v0] Erro ao criar aluno:", error)
    return Response.json({ error: "Erro ao criar aluno", message: error.message }, { status: 500 })
  }
}
