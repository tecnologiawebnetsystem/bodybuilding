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
        user_id, name, cpf, email, phone, pin, role, gym_id,
        age, gender, height, initial_weight, target_weight, current_weight,
        injuries_limitations, start_date
      ) VALUES (
        ${user_id},
        ${data.name},
        ${data.cpf || '000.000.000-00'},
        ${data.email || null},
        ${data.phone || null},
        ${pin},
        'student',
        1,
        ${data.age || 25},
        ${data.gender || 'Masculino'},
        ${data.height || 170},
        ${data.currentWeight || 70},
        ${data.targetWeight || 70},
        ${data.currentWeight || 70},
        ${data.injuriesLimitations || null},
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
        enable_gym_workouts,
        running_level,
        home_workout_focus,
        nutrition_goal,
        workout_goal
      ) VALUES (
        ${user_id},
        ${data.includeHomeWorkouts || false},
        ${data.includeRunning || false},
        ${data.includeSupplements || false},
        ${data.includeNutrition || false},
        ${data.includeHomeWorkouts || false},
        true,
        ${data.runningLevel || 'beginner'},
        ${data.homeFocus?.join(',') || ''},
        ${data.dietType || 'balanced'},
        ${data.primaryGoal || 'gain_muscle'}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        enable_calisthenics = EXCLUDED.enable_calisthenics,
        enable_running = EXCLUDED.enable_running,
        enable_supplements = EXCLUDED.enable_supplements,
        enable_nutrition = EXCLUDED.enable_nutrition,
        enable_home_workouts = EXCLUDED.enable_home_workouts,
        enable_gym_workouts = EXCLUDED.enable_gym_workouts,
        running_level = EXCLUDED.running_level,
        home_workout_focus = EXCLUDED.home_workout_focus,
        nutrition_goal = EXCLUDED.nutrition_goal,
        workout_goal = EXCLUDED.workout_goal
    `

    // Salvar configuracao de treino
    await sql`
      INSERT INTO user_training_config (
        user_id,
        training_frequency,
        training_split,
        workout_duration_min,
        workout_duration_max,
        primary_goal,
        experience_level,
        intensity_level
      ) VALUES (
        ${user_id},
        ${data.gymFrequency || 4},
        ${data.preferredSplit || 'abc'},
        ${data.sessionDuration || 60},
        ${data.sessionDuration || 60},
        ${data.primaryGoal || 'gain_muscle'},
        ${data.trainingExperience || 'beginner'},
        ${data.goalIntensity || 'moderate'}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        training_frequency = EXCLUDED.training_frequency,
        training_split = EXCLUDED.training_split,
        workout_duration_min = EXCLUDED.workout_duration_min,
        workout_duration_max = EXCLUDED.workout_duration_max,
        primary_goal = EXCLUDED.primary_goal,
        experience_level = EXCLUDED.experience_level,
        intensity_level = EXCLUDED.intensity_level
    `

    // Salvar configuracao de nutricao se houver
    if (data.includeNutrition) {
      await sql`
        INSERT INTO user_nutrition_config (
          user_id,
          diet_type,
          meals_per_day,
          avoid_foods
        ) VALUES (
          ${user_id},
          ${data.dietType || 'balanced'},
          ${data.mealsPerDay || 4},
          ${data.foodRestrictions?.join(',') || ''}
        )
        ON CONFLICT (user_id) DO UPDATE SET
          diet_type = EXCLUDED.diet_type,
          meals_per_day = EXCLUDED.meals_per_day,
          avoid_foods = EXCLUDED.avoid_foods
      `
    }

    // Salvar configuracao de cardio/corrida se houver
    if (data.includeRunning) {
      await sql`
        INSERT INTO user_cardio_config (
          user_id,
          cardio_frequency,
          intensity_level,
          preferred_type
        ) VALUES (
          ${user_id},
          ${data.runningFrequency || 2},
          ${data.runningLevel || 'beginner'},
          'running'
        )
        ON CONFLICT (user_id) DO UPDATE SET
          cardio_frequency = EXCLUDED.cardio_frequency,
          intensity_level = EXCLUDED.intensity_level,
          preferred_type = EXCLUDED.preferred_type
      `
    }

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
