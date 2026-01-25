import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// API para gerenciar vinculos de alunos com academias e trainers

// GET - Buscar vinculos de um aluno ou de uma academia/trainer
export async function GET(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const { searchParams } = new URL(request.url)
    
    const studentId = searchParams.get("studentId")
    const gymId = searchParams.get("gymId")
    const trainerId = searchParams.get("trainerId")
    const type = searchParams.get("type") // 'gym' ou 'trainer'

    // Buscar vinculos de academia de um aluno
    if (studentId && type === "gym") {
      const memberships = await sql`
        SELECT 
          gm.*,
          g.gym_name,
          g.logo_url,
          g.address,
          g.city,
          t.name as trainer_name
        FROM gym_student_memberships gm
        JOIN gyms g ON g.id = gm.gym_id
        LEFT JOIN users t ON t.user_id = gm.assigned_trainer_id
        WHERE gm.student_user_id = ${studentId}
        ORDER BY gm.created_at DESC
      `
      return NextResponse.json({ memberships })
    }

    // Buscar vinculos de trainer particular de um aluno
    if (studentId && type === "trainer") {
      const memberships = await sql`
        SELECT 
          pt.*,
          u.name as trainer_name,
          u.email as trainer_email,
          tp.specialties,
          tp.profile_photo_url
        FROM private_training_links pt
        JOIN users u ON u.user_id = pt.trainer_user_id
        LEFT JOIN trainer_profiles_new tp ON tp.user_id = pt.trainer_user_id
        WHERE pt.student_user_id = ${studentId}
        ORDER BY pt.created_at DESC
      `
      return NextResponse.json({ memberships })
    }

    // Buscar alunos de uma academia
    if (gymId) {
      const students = await sql`
        SELECT 
          gm.*,
          u.name as student_name,
          u.email as student_email,
          u.phone,
          u.profile_photo_url,
          t.name as trainer_name
        FROM gym_student_memberships gm
        JOIN users u ON u.user_id = gm.student_user_id
        LEFT JOIN users t ON t.user_id = gm.assigned_trainer_id
        WHERE gm.gym_id = ${gymId}
        ORDER BY gm.created_at DESC
      `
      return NextResponse.json({ students })
    }

    // Buscar alunos particulares de um trainer
    if (trainerId) {
      const students = await sql`
        SELECT 
          pt.*,
          u.name as student_name,
          u.email as student_email,
          u.phone,
          u.profile_photo_url,
          u.current_weight,
          u.target_weight
        FROM private_training_links pt
        JOIN users u ON u.user_id = pt.student_user_id
        WHERE pt.trainer_user_id = ${trainerId}
        ORDER BY pt.created_at DESC
      `
      return NextResponse.json({ students })
    }

    return NextResponse.json({ error: "Parametros invalidos" }, { status: 400 })
  } catch (error) {
    console.error("[Memberships] GET error:", error)
    return NextResponse.json({ error: "Erro ao buscar vinculos" }, { status: 500 })
  }
}

// POST - Criar novo vinculo
export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const body = await request.json()
    
    const { 
      type, // 'gym' ou 'trainer'
      studentUserId,
      gymId,
      trainerUserId,
      assignedTrainerId, // trainer designado na academia
      membershipType,
      trainingType,
      monthlyFee,
      sessionsPerWeek,
      sessionDurationMin,
      startDate,
      endDate,
      autoRenew,
      notes
    } = body

    if (type === "gym" && studentUserId && gymId) {
      // Verificar se ja existe vinculo ativo
      const existing = await sql`
        SELECT id FROM gym_student_memberships 
        WHERE gym_id = ${gymId} AND student_user_id = ${studentUserId} AND status = 'active'
      `
      if (existing.length > 0) {
        return NextResponse.json({ error: "Aluno ja esta vinculado a esta academia" }, { status: 409 })
      }

      // Criar vinculo com academia
      const result = await sql`
        INSERT INTO gym_student_memberships (
          gym_id, student_user_id, status, membership_type, assigned_trainer_id,
          monthly_fee, start_date, end_date, auto_renew, notes, created_at
        ) VALUES (
          ${gymId}, ${studentUserId}, 'active', ${membershipType || 'standard'},
          ${assignedTrainerId || null}, ${monthlyFee || null},
          ${startDate || new Date().toISOString().split('T')[0]},
          ${endDate || null}, ${autoRenew !== false}, ${notes || null}, NOW()
        ) RETURNING *
      `

      // Atualizar usuario para nao ser mais independente
      await sql`
        UPDATE users SET is_independent = false WHERE user_id = ${studentUserId}
      `

      return NextResponse.json({ success: true, membership: result[0] })
    }

    if (type === "trainer" && studentUserId && trainerUserId) {
      // Verificar se ja existe vinculo ativo
      const existing = await sql`
        SELECT id FROM private_training_links 
        WHERE trainer_user_id = ${trainerUserId} AND student_user_id = ${studentUserId} AND status = 'active'
      `
      if (existing.length > 0) {
        return NextResponse.json({ error: "Aluno ja esta vinculado a este personal" }, { status: 409 })
      }

      // Criar vinculo com trainer particular
      const result = await sql`
        INSERT INTO private_training_links (
          trainer_user_id, student_user_id, status, training_type,
          monthly_fee, sessions_per_week, session_duration_min,
          start_date, end_date, auto_renew, notes, created_at
        ) VALUES (
          ${trainerUserId}, ${studentUserId}, 'active', ${trainingType || 'presencial'},
          ${monthlyFee || null}, ${sessionsPerWeek || 2}, ${sessionDurationMin || 60},
          ${startDate || new Date().toISOString().split('T')[0]},
          ${endDate || null}, ${autoRenew !== false}, ${notes || null}, NOW()
        ) RETURNING *
      `

      // Atualizar usuario para nao ser mais independente
      await sql`
        UPDATE users SET is_independent = false WHERE user_id = ${studentUserId}
      `

      return NextResponse.json({ success: true, membership: result[0] })
    }

    return NextResponse.json({ error: "Parametros invalidos" }, { status: 400 })
  } catch (error) {
    console.error("[Memberships] POST error:", error)
    return NextResponse.json({ error: "Erro ao criar vinculo" }, { status: 500 })
  }
}

// PUT - Atualizar vinculo
export async function PUT(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const body = await request.json()
    
    const { 
      id,
      type, // 'gym' ou 'trainer'
      status,
      assignedTrainerId,
      membershipType,
      trainingType,
      monthlyFee,
      endDate,
      autoRenew,
      notes
    } = body

    if (type === "gym" && id) {
      await sql`
        UPDATE gym_student_memberships SET
          status = COALESCE(${status}, status),
          assigned_trainer_id = COALESCE(${assignedTrainerId}, assigned_trainer_id),
          membership_type = COALESCE(${membershipType}, membership_type),
          monthly_fee = COALESCE(${monthlyFee}, monthly_fee),
          end_date = COALESCE(${endDate}, end_date),
          auto_renew = COALESCE(${autoRenew}, auto_renew),
          notes = COALESCE(${notes}, notes),
          updated_at = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ success: true })
    }

    if (type === "trainer" && id) {
      await sql`
        UPDATE private_training_links SET
          status = COALESCE(${status}, status),
          training_type = COALESCE(${trainingType}, training_type),
          monthly_fee = COALESCE(${monthlyFee}, monthly_fee),
          end_date = COALESCE(${endDate}, end_date),
          auto_renew = COALESCE(${autoRenew}, auto_renew),
          notes = COALESCE(${notes}, notes),
          updated_at = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Parametros invalidos" }, { status: 400 })
  } catch (error) {
    console.error("[Memberships] PUT error:", error)
    return NextResponse.json({ error: "Erro ao atualizar vinculo" }, { status: 500 })
  }
}

// DELETE - Remover vinculo (soft delete - muda status para cancelled)
export async function DELETE(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const { searchParams } = new URL(request.url)
    
    const id = searchParams.get("id")
    const type = searchParams.get("type")

    if (type === "gym" && id) {
      await sql`
        UPDATE gym_student_memberships 
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ success: true })
    }

    if (type === "trainer" && id) {
      await sql`
        UPDATE private_training_links 
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Parametros invalidos" }, { status: 400 })
  } catch (error) {
    console.error("[Memberships] DELETE error:", error)
    return NextResponse.json({ error: "Erro ao remover vinculo" }, { status: 500 })
  }
}
