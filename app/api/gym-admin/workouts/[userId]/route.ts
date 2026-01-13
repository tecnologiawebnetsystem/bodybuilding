import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    // Buscar plano de treinos da semana
    const workouts = await sql`
      SELECT 
        w.id,
        w.user_id,
        w.day_of_week,
        w.workout_name,
        w.description,
        w.created_at,
        w.updated_at
      FROM weekly_workout_schedule w
      WHERE w.user_id = ${userId}
      ORDER BY w.day_of_week
    `

    // Buscar exercícios de cada treino
    const workoutPlan = await Promise.all(
      workouts.map(async (workout) => {
        const exercises = await sql`
          SELECT 
            id,
            exercise_name,
            sets,
            reps_min,
            reps_max,
            rest_seconds,
            exercise_order,
            notes
          FROM user_custom_exercises
          WHERE user_id = ${userId} 
            AND workout_day = ${String(workout.day_of_week)}
          ORDER BY exercise_order
        `

        return {
          ...workout,
          exercises: exercises || [],
        }
      }),
    )

    return NextResponse.json(workoutPlan)
  } catch (error) {
    console.error("Erro ao buscar treinos:", error)
    return NextResponse.json({ error: "Erro ao buscar treinos" }, { status: 500 })
  }
}
