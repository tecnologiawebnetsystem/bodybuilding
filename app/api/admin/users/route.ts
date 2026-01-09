import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Listar todos os usuários com suas preferências
export async function GET(request: NextRequest) {
  try {
    const users = await sql`
      SELECT 
        u.*,
        p.theme_primary,
        p.theme_secondary,
        p.theme_accent,
        p.enable_gym_checkin,
        p.enable_gym_workouts,
        p.enable_running,
        p.enable_home_workouts,
        p.enable_nutrition,
        p.enable_supplements,
        p.enable_measurements,
        p.enable_hydration,
        p.enable_stats,
        p.workout_type,
        p.workout_goal,
        p.running_level,
        p.nutrition_goal,
        p.home_workout_focus
      FROM users u
      LEFT JOIN user_preferences p ON u.user_id = p.user_id
      ORDER BY u.id
    `

    return NextResponse.json({ users })
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 })
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { adminUsername, user } = data

    console.log("[v0] Creating new user:", user.user_id)

    // Inserir usuário
    await sql`
      INSERT INTO users (
        user_id, name, pin, height, target_weight, 
        gender, age, initial_weight, start_date
      ) VALUES (
        ${user.user_id}, ${user.name}, ${user.pin}, 
        ${user.height}, ${user.target_weight}, ${user.gender},
        ${user.age}, ${user.initial_weight}, CURRENT_DATE
      )
    `

    // Inserir preferências
    await sql`
      INSERT INTO user_preferences (
        user_id, theme_primary, theme_secondary, theme_accent,
        enable_gym_checkin, enable_gym_workouts, enable_running,
        enable_home_workouts, enable_nutrition, enable_supplements,
        enable_measurements, enable_hydration, enable_stats,
        workout_type, workout_goal, running_level,
        nutrition_goal, home_workout_focus
      ) VALUES (
        ${user.user_id}, ${user.preferences.theme_primary},
        ${user.preferences.theme_secondary}, ${user.preferences.theme_accent},
        ${user.preferences.enable_gym_checkin}, ${user.preferences.enable_gym_workouts},
        ${user.preferences.enable_running}, ${user.preferences.enable_home_workouts},
        ${user.preferences.enable_nutrition}, ${user.preferences.enable_supplements},
        ${user.preferences.enable_measurements}, ${user.preferences.enable_hydration},
        ${user.preferences.enable_stats}, ${user.preferences.workout_type},
        ${user.preferences.workout_goal}, ${user.preferences.running_level},
        ${user.preferences.nutrition_goal}, ${user.preferences.home_workout_focus}
      )
    `

    // Log da ação
    await sql`
      INSERT INTO admin_audit_log (admin_username, action, target_user_id, details)
      VALUES (${adminUsername}, 'CREATE_USER', ${user.user_id}, 
        'Criou usuário: ' || ${user.name})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}

// PUT - Atualizar usuário
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { adminUsername, userId, user, preferences } = data

    console.log("[v0] Updating user:", userId)

    // Atualizar dados do usuário
    await sql`
      UPDATE users SET
        name = ${user.name},
        pin = ${user.pin},
        height = ${user.height},
        target_weight = ${user.target_weight},
        gender = ${user.gender},
        age = ${user.age},
        current_weight = ${user.current_weight}
      WHERE user_id = ${userId}
    `

    // Atualizar preferências
    await sql`
      UPDATE user_preferences SET
        theme_primary = ${preferences.theme_primary},
        theme_secondary = ${preferences.theme_secondary},
        theme_accent = ${preferences.theme_accent},
        enable_gym_checkin = ${preferences.enable_gym_checkin},
        enable_gym_workouts = ${preferences.enable_gym_workouts},
        enable_running = ${preferences.enable_running},
        enable_home_workouts = ${preferences.enable_home_workouts},
        enable_nutrition = ${preferences.enable_nutrition},
        enable_supplements = ${preferences.enable_supplements},
        enable_measurements = ${preferences.enable_measurements},
        enable_hydration = ${preferences.enable_hydration},
        enable_stats = ${preferences.enable_stats},
        workout_type = ${preferences.workout_type},
        workout_goal = ${preferences.workout_goal},
        running_level = ${preferences.running_level},
        nutrition_goal = ${preferences.nutrition_goal},
        home_workout_focus = ${preferences.home_workout_focus},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    // Log da ação
    await sql`
      INSERT INTO admin_audit_log (admin_username, action, target_user_id, details)
      VALUES (${adminUsername}, 'UPDATE_USER', ${userId}, 
        'Atualizou usuário: ' || ${user.name})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

// DELETE - Excluir usuário
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const adminUsername = searchParams.get("adminUsername")

    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    }

    console.log("[v0] Deleting user:", userId)

    // Deletar usuário (cascade vai deletar preferências automaticamente)
    const result = await sql`
      DELETE FROM users WHERE user_id = ${userId}
      RETURNING name
    `

    // Log da ação
    if (result.length > 0) {
      await sql`
        INSERT INTO admin_audit_log (admin_username, action, target_user_id, details)
        VALUES (${adminUsername}, 'DELETE_USER', ${userId}, 
          'Excluiu usuário: ' || ${result[0].name})
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting user:", error)
    return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 })
  }
}
