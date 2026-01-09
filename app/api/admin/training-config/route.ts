import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Buscar configuração de treino de um usuário
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 })
    }

    const config = await sql`
      SELECT * FROM user_training_config WHERE user_id = ${userId}
    `

    const exercises = await sql`
      SELECT * FROM user_custom_exercises 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY workout_day, exercise_order
    `

    const cardioConfig = await sql`
      SELECT * FROM user_cardio_config WHERE user_id = ${userId}
    `

    const nutritionConfig = await sql`
      SELECT * FROM user_nutrition_config WHERE user_id = ${userId}
    `

    const supplementConfig = await sql`
      SELECT * FROM user_supplement_config 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY timing
    `

    return Response.json({
      training: config[0] || null,
      exercises: exercises || [],
      cardio: cardioConfig[0] || null,
      nutrition: nutritionConfig[0] || null,
      supplements: supplementConfig || [],
    })
  } catch (error) {
    console.error("Error fetching training config:", error)
    return Response.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}

// POST - Salvar/atualizar configuração completa
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, training, cardio, nutrition } = data

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 })
    }

    // Atualizar configuração de treino
    if (training) {
      await sql`
        INSERT INTO user_training_config (
          user_id, training_frequency, training_split, periodization_type,
          experience_level, sets_per_exercise_min, sets_per_exercise_max,
          reps_min, reps_max, rest_between_sets, rest_between_exercises,
          intensity_level, progression_rate, use_drop_sets, use_super_sets,
          use_giant_sets, workout_duration_min, workout_duration_max,
          warmup_duration, cooldown_duration, primary_goal, secondary_goal,
          updated_at
        ) VALUES (
          ${userId}, ${training.training_frequency}, ${training.training_split},
          ${training.periodization_type}, ${training.experience_level},
          ${training.sets_per_exercise_min}, ${training.sets_per_exercise_max},
          ${training.reps_min}, ${training.reps_max}, ${training.rest_between_sets},
          ${training.rest_between_exercises}, ${training.intensity_level},
          ${training.progression_rate}, ${training.use_drop_sets},
          ${training.use_super_sets}, ${training.use_giant_sets},
          ${training.workout_duration_min}, ${training.workout_duration_max},
          ${training.warmup_duration}, ${training.cooldown_duration},
          ${training.primary_goal}, ${training.secondary_goal}, CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id) DO UPDATE SET
          training_frequency = EXCLUDED.training_frequency,
          training_split = EXCLUDED.training_split,
          periodization_type = EXCLUDED.periodization_type,
          experience_level = EXCLUDED.experience_level,
          sets_per_exercise_min = EXCLUDED.sets_per_exercise_min,
          sets_per_exercise_max = EXCLUDED.sets_per_exercise_max,
          reps_min = EXCLUDED.reps_min,
          reps_max = EXCLUDED.reps_max,
          rest_between_sets = EXCLUDED.rest_between_sets,
          rest_between_exercises = EXCLUDED.rest_between_exercises,
          intensity_level = EXCLUDED.intensity_level,
          progression_rate = EXCLUDED.progression_rate,
          use_drop_sets = EXCLUDED.use_drop_sets,
          use_super_sets = EXCLUDED.use_super_sets,
          use_giant_sets = EXCLUDED.use_giant_sets,
          workout_duration_min = EXCLUDED.workout_duration_min,
          workout_duration_max = EXCLUDED.workout_duration_max,
          warmup_duration = EXCLUDED.warmup_duration,
          cooldown_duration = EXCLUDED.cooldown_duration,
          primary_goal = EXCLUDED.primary_goal,
          secondary_goal = EXCLUDED.secondary_goal,
          updated_at = EXCLUDED.updated_at
      `
    }

    // Atualizar configuração de cardio
    if (cardio) {
      await sql`
        INSERT INTO user_cardio_config (
          user_id, cardio_frequency, duration_min, duration_max,
          intensity_level, heart_rate_zone, preferred_type,
          weekly_increase_percent, max_weekly_increase_km,
          use_hiit, hiit_work_seconds, hiit_rest_seconds, hiit_rounds,
          updated_at
        ) VALUES (
          ${userId}, ${cardio.cardio_frequency}, ${cardio.duration_min},
          ${cardio.duration_max}, ${cardio.intensity_level},
          ${cardio.heart_rate_zone}, ${cardio.preferred_type},
          ${cardio.weekly_increase_percent}, ${cardio.max_weekly_increase_km},
          ${cardio.use_hiit}, ${cardio.hiit_work_seconds},
          ${cardio.hiit_rest_seconds}, ${cardio.hiit_rounds}, CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id) DO UPDATE SET
          cardio_frequency = EXCLUDED.cardio_frequency,
          duration_min = EXCLUDED.duration_min,
          duration_max = EXCLUDED.duration_max,
          intensity_level = EXCLUDED.intensity_level,
          heart_rate_zone = EXCLUDED.heart_rate_zone,
          preferred_type = EXCLUDED.preferred_type,
          weekly_increase_percent = EXCLUDED.weekly_increase_percent,
          max_weekly_increase_km = EXCLUDED.max_weekly_increase_km,
          use_hiit = EXCLUDED.use_hiit,
          hiit_work_seconds = EXCLUDED.hiit_work_seconds,
          hiit_rest_seconds = EXCLUDED.hiit_rest_seconds,
          hiit_rounds = EXCLUDED.hiit_rounds,
          updated_at = EXCLUDED.updated_at
      `
    }

    // Atualizar configuração de nutrição
    if (nutrition) {
      const proteinGrams = Math.round((nutrition.daily_calories * nutrition.protein_percent) / 100 / 4)
      const carbsGrams = Math.round((nutrition.daily_calories * nutrition.carbs_percent) / 100 / 4)
      const fatsGrams = Math.round((nutrition.daily_calories * nutrition.fats_percent) / 100 / 9)

      await sql`
        INSERT INTO user_nutrition_config (
          user_id, daily_calories, calorie_deficit_percent, calorie_surplus_percent,
          protein_percent, carbs_percent, fats_percent,
          protein_grams, carbs_grams, fats_grams,
          meals_per_day, meal_timing_preference, diet_type,
          avoid_foods, water_goal_ml, updated_at
        ) VALUES (
          ${userId}, ${nutrition.daily_calories}, ${nutrition.calorie_deficit_percent},
          ${nutrition.calorie_surplus_percent}, ${nutrition.protein_percent},
          ${nutrition.carbs_percent}, ${nutrition.fats_percent},
          ${proteinGrams}, ${carbsGrams}, ${fatsGrams},
          ${nutrition.meals_per_day}, ${nutrition.meal_timing_preference},
          ${nutrition.diet_type}, ${nutrition.avoid_foods}, ${nutrition.water_goal_ml},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id) DO UPDATE SET
          daily_calories = EXCLUDED.daily_calories,
          calorie_deficit_percent = EXCLUDED.calorie_deficit_percent,
          calorie_surplus_percent = EXCLUDED.calorie_surplus_percent,
          protein_percent = EXCLUDED.protein_percent,
          carbs_percent = EXCLUDED.carbs_percent,
          fats_percent = EXCLUDED.fats_percent,
          protein_grams = EXCLUDED.protein_grams,
          carbs_grams = EXCLUDED.carbs_grams,
          fats_grams = EXCLUDED.fats_grams,
          meals_per_day = EXCLUDED.meals_per_day,
          meal_timing_preference = EXCLUDED.meal_timing_preference,
          diet_type = EXCLUDED.diet_type,
          avoid_foods = EXCLUDED.avoid_foods,
          water_goal_ml = EXCLUDED.water_goal_ml,
          updated_at = EXCLUDED.updated_at
      `
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error saving training config:", error)
    return Response.json({ error: "Failed to save config" }, { status: 500 })
  }
}
