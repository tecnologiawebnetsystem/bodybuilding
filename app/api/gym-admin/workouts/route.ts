import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, day_of_week, workout_name, description, exercises } = body

    // Salvar ou atualizar o dia de treino
    const [workout] = await sql`
      INSERT INTO weekly_workout_schedule (user_id, day_of_week, workout_name, description, updated_at)
      VALUES (${user_id}, ${day_of_week}, ${workout_name}, ${description}, NOW())
      ON CONFLICT (user_id, day_of_week)
      DO UPDATE SET 
        workout_name = ${workout_name},
        description = ${description},
        updated_at = NOW()
      RETURNING id
    `

    // Remover exercícios antigos deste dia
    await sql`
      DELETE FROM user_custom_exercises 
      WHERE user_id = ${user_id} AND workout_day = ${String(day_of_week)}
    `

    // Inserir novos exercícios
    if (exercises && exercises.length > 0) {
      for (const exercise of exercises) {
        await sql`
          INSERT INTO user_custom_exercises (
            user_id, 
            workout_day, 
            exercise_name, 
            sets, 
            reps_min, 
            reps_max, 
            rest_seconds, 
            exercise_order, 
            notes,
            is_active
          )
          VALUES (
            ${user_id},
            ${String(day_of_week)},
            ${exercise.exercise_name},
            ${exercise.sets},
            ${exercise.reps_min},
            ${exercise.reps_max},
            ${exercise.rest_seconds},
            ${exercise.exercise_order},
            ${exercise.notes || ""},
            true
          )
        `
      }
    }

    return NextResponse.json({ success: true, workout })
  } catch (error) {
    console.error("Erro ao salvar treino:", error)
    return NextResponse.json({ error: "Erro ao salvar treino" }, { status: 500 })
  }
}
