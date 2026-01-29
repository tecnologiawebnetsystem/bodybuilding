import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

// Login unificado para todos os tipos de usuario
// Suporta: super_admin, gym_owner, trainer, student (vinculado ou independente)

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    const body = await request.json()
    const { identifier, password, pin, loginType } = body

    // Login pode ser por email+senha OU por PIN
    let user = null
    let authMethod = ""

    if (identifier && pin) {
      // Login por CPF + PIN (fluxo unificado)
      authMethod = "cpf_pin"
      const cleanCPF = identifier.replace(/\D/g, "")
      
      const users = await sql`
        SELECT 
          user_id, name, email, cpf, pin, role, account_type, is_independent,
          gym_id, personal_trainer_id, profile_photo_url
        FROM users 
        WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ${cleanCPF} AND pin = ${pin}
      `
      user = users[0]

      if (!user) {
        return NextResponse.json({ error: "CPF ou PIN incorretos" }, { status: 401 })
      }
    } else if (pin && !identifier) {
      // Login apenas por PIN (backward compatibility)
      authMethod = "pin"
      const users = await sql`
        SELECT 
          user_id, name, email, pin, role, account_type, is_independent,
          gym_id, personal_trainer_id, profile_photo_url
        FROM users 
        WHERE pin = ${pin} AND (role = 'student' OR account_type = 'student')
      `
      user = users[0]

      if (!user) {
        return NextResponse.json({ error: "PIN invalido" }, { status: 401 })
      }
    } else if (identifier && password) {
      // Login por email/cpf + senha
      authMethod = "password"
      
      // Buscar usuario por email ou CPF
      const users = await sql`
        SELECT 
          user_id, name, email, cpf, password, pin, role, account_type, is_independent,
          gym_id, personal_trainer_id, profile_photo_url
        FROM users 
        WHERE email = ${identifier} OR cpf = ${identifier}
      `
      user = users[0]

      if (!user) {
        return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 401 })
      }

      // Verificar senha
      if (user.password) {
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
        }
      } else {
        return NextResponse.json({ error: "Usuario nao possui senha configurada" }, { status: 401 })
      }
    } else {
      return NextResponse.json({ error: "Credenciais incompletas" }, { status: 400 })
    }

    // Verificar se e super admin
    const adminCheck = await sql`
      SELECT level, permissions FROM system_admins WHERE user_id = ${user.user_id}
    `
    const isSuperAdmin = adminCheck.length > 0

    // Buscar vinculos do usuario
    let gymMemberships = []
    let trainerMemberships = []
    let worksAtGyms = []
    let ownedGyms = []

    // Se for aluno, buscar academias e trainers vinculados
    if (user.account_type === 'student' || user.role === 'student') {
      const gyms = await sql`
        SELECT gm.*, g.gym_name, g.logo_url
        FROM gym_student_memberships gm
        JOIN gyms g ON g.id = gm.gym_id
        WHERE gm.student_user_id = ${user.user_id} AND gm.status = 'active'
      `
      gymMemberships = gyms

      const trainers = await sql`
        SELECT pt.*, u.name as trainer_name
        FROM private_training_links pt
        JOIN users u ON u.user_id = pt.trainer_user_id
        WHERE pt.student_user_id = ${user.user_id} AND pt.status = 'active'
      `
      trainerMemberships = trainers
    }

    // Se for trainer, buscar academias onde trabalha e alunos particulares
    if (user.account_type === 'trainer' || user.role === 'trainer') {
      const gyms = await sql`
        SELECT gt.*, g.gym_name, g.logo_url
        FROM gym_trainer_links gt
        JOIN gyms g ON g.id = gt.gym_id
        WHERE gt.trainer_user_id = ${user.user_id} AND gt.status = 'active'
      `
      worksAtGyms = gyms
    }

    // Se for dono de academia, buscar academias
    if (user.account_type === 'gym_owner' || user.role === 'gym_owner') {
      const gyms = await sql`
        SELECT * FROM gyms WHERE owner_user_id = ${user.user_id} AND is_active = true
      `
      ownedGyms = gyms
    }

    // Atualizar ultimo login
    await sql`
      UPDATE users 
      SET last_login_at = NOW(), login_count = COALESCE(login_count, 0) + 1 
      WHERE user_id = ${user.user_id}
    `

    // Determinar tipo efetivo do usuario
    let effectiveRole = user.account_type || user.role || 'student'
    if (isSuperAdmin) {
      effectiveRole = 'super_admin'
    }

    // Determinar para onde redirecionar
    let redirectTo = '/dashboard'
    switch (effectiveRole) {
      case 'super_admin':
        redirectTo = '/super-admin'
        break
      case 'gym_owner':
        redirectTo = '/gym-admin'
        break
      case 'trainer':
        redirectTo = '/trainer'
        break
      case 'student':
        if (user.is_independent) {
          redirectTo = '/app'
        } else if (gymMemberships.length > 0 || trainerMemberships.length > 0) {
          redirectTo = '/app'
        } else {
          redirectTo = '/app' // Aluno sem vinculo ainda
        }
        break
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: effectiveRole,
        accountType: user.account_type,
        isIndependent: user.is_independent,
        profilePhoto: user.profile_photo_url,
        isSuperAdmin,
        adminLevel: isSuperAdmin ? adminCheck[0].level : null,
        adminPermissions: isSuperAdmin ? adminCheck[0].permissions : null,
      },
      connections: {
        gymMemberships,
        trainerMemberships,
        worksAtGyms,
        ownedGyms,
      },
      authMethod,
      redirectTo,
    })
  } catch (error) {
    console.error("[Auth] Login error:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
