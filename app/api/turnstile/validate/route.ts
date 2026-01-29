import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

/**
 * API de Validacao de Acesso para Catracas
 * 
 * Esta API e chamada pela catraca quando um aluno tenta entrar.
 * Compativel com: Henry, Control iD, Topdata, Dimep e outras.
 * 
 * Metodos de identificacao suportados:
 * - QR Code (token dinamico)
 * - Cartao RFID/NFC
 * - Biometria (template ID)
 * - PIN numerico
 * - CPF
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      turnstile_code,    // Codigo da catraca
      auth_method,       // qrcode, rfid, biometric, pin, cpf
      credential,        // Token QR, numero RFID, template bio, PIN ou CPF
      direction = "entry" // entry ou exit
    } = body

    // Validar catraca
    const turnstiles = await sql`
      SELECT * FROM turnstiles 
      WHERE turnstile_code = ${turnstile_code} AND is_active = true
    `

    if (turnstiles.length === 0) {
      return NextResponse.json({
        granted: false,
        reason: "CATRACA_INVALIDA",
        message: "Catraca nao cadastrada ou inativa",
        display: "ERRO CATRACA"
      }, { status: 400 })
    }

    const turnstile = turnstiles[0]

    // Buscar usuario baseado no metodo de autenticacao
    let user = null
    let accessToken = null

    if (auth_method === "qrcode") {
      // Buscar por token QR
      const tokens = await sql`
        SELECT uat.*, u.* FROM user_access_tokens uat
        JOIN users u ON uat.user_id = u.user_id
        WHERE uat.access_token = ${credential} 
          AND uat.is_active = true
          AND (uat.expires_at IS NULL OR uat.expires_at > NOW())
      `
      if (tokens.length > 0) {
        user = tokens[0]
        accessToken = credential
      }
    } else if (auth_method === "rfid") {
      // Buscar por cartao RFID
      const tokens = await sql`
        SELECT uat.*, u.* FROM user_access_tokens uat
        JOIN users u ON uat.user_id = u.user_id
        WHERE uat.rfid_card_number = ${credential} AND uat.is_active = true
      `
      if (tokens.length > 0) {
        user = tokens[0]
        accessToken = tokens[0].access_token
      }
    } else if (auth_method === "biometric") {
      // Buscar por template biometrico
      const tokens = await sql`
        SELECT uat.*, u.* FROM user_access_tokens uat
        JOIN users u ON uat.user_id = u.user_id
        WHERE uat.biometric_template_id = ${credential} AND uat.is_active = true
      `
      if (tokens.length > 0) {
        user = tokens[0]
        accessToken = tokens[0].access_token
      }
    } else if (auth_method === "pin") {
      // Buscar por PIN
      const users = await sql`
        SELECT * FROM users WHERE pin = ${credential}
      `
      if (users.length > 0) {
        user = users[0]
      }
    } else if (auth_method === "cpf") {
      // Buscar por CPF
      const cleanCPF = credential.replace(/\D/g, "")
      const users = await sql`
        SELECT * FROM users 
        WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ${cleanCPF}
      `
      if (users.length > 0) {
        user = users[0]
      }
    }

    // Usuario nao encontrado
    if (!user) {
      await logAccess(turnstile.id, null, direction, auth_method, credential, "denied", "USUARIO_NAO_ENCONTRADO")
      return NextResponse.json({
        granted: false,
        reason: "USUARIO_NAO_ENCONTRADO",
        message: "Credencial nao cadastrada",
        display: "NAO CADASTRADO"
      })
    }

    // Verificar se o plano esta em dia
    const payments = await sql`
      SELECT * FROM student_payments 
      WHERE user_id = ${user.user_id} 
        AND status = 'paid'
        AND due_date >= CURRENT_DATE - INTERVAL '5 days'
      ORDER BY due_date DESC
      LIMIT 1
    `

    // Verificar tambem na tabela de memberships
    const memberships = await sql`
      SELECT * FROM memberships 
      WHERE user_id = ${user.user_id} 
        AND status = 'active'
        AND end_date >= CURRENT_DATE
      LIMIT 1
    `

    const hasPaidMembership = payments.length > 0 || memberships.length > 0

    if (!hasPaidMembership) {
      await logAccess(turnstile.id, user.user_id, direction, auth_method, accessToken, "denied", "PAGAMENTO_PENDENTE")
      return NextResponse.json({
        granted: false,
        reason: "PAGAMENTO_PENDENTE",
        message: "Mensalidade em atraso",
        display: "PGTO PENDENTE",
        user_name: user.name?.split(" ")[0] || "Aluno"
      })
    }

    // Verificar horario de acesso (regras)
    const now = new Date()
    const currentDay = now.getDay() // 0-6
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM

    const rules = await sql`
      SELECT * FROM access_rules 
      WHERE gym_id = ${turnstile.gym_id} AND is_active = true
      LIMIT 1
    `

    if (rules.length > 0) {
      const rule = rules[0]
      const allowedDays = rule.allowed_days.split(",").map(Number)
      
      if (!allowedDays.includes(currentDay)) {
        await logAccess(turnstile.id, user.user_id, direction, auth_method, accessToken, "denied", "DIA_NAO_PERMITIDO")
        return NextResponse.json({
          granted: false,
          reason: "DIA_NAO_PERMITIDO",
          message: "Acesso nao permitido neste dia",
          display: "DIA BLOQUEADO",
          user_name: user.name?.split(" ")[0] || "Aluno"
        })
      }

      if (currentTime < rule.start_time || currentTime > rule.end_time) {
        await logAccess(turnstile.id, user.user_id, direction, auth_method, accessToken, "denied", "HORARIO_NAO_PERMITIDO")
        return NextResponse.json({
          granted: false,
          reason: "HORARIO_NAO_PERMITIDO",
          message: `Horario permitido: ${rule.start_time} - ${rule.end_time}`,
          display: "FORA HORARIO",
          user_name: user.name?.split(" ")[0] || "Aluno"
        })
      }
    }

    // ACESSO LIBERADO!
    await logAccess(turnstile.id, user.user_id, direction, auth_method, accessToken, "granted", null)

    // Atualizar ping da catraca
    await sql`
      UPDATE turnstiles SET last_ping = NOW() WHERE id = ${turnstile.id}
    `

    return NextResponse.json({
      granted: true,
      reason: "OK",
      message: "Acesso liberado",
      display: `OLA ${(user.name?.split(" ")[0] || "ALUNO").toUpperCase()}`,
      user_id: user.user_id,
      user_name: user.name,
      photo_url: user.profile_photo_url
    })

  } catch (error) {
    console.error("[v0] Turnstile validation error:", error)
    return NextResponse.json({
      granted: false,
      reason: "ERRO_SISTEMA",
      message: "Erro interno do sistema",
      display: "ERRO SISTEMA"
    }, { status: 500 })
  }
}

// Funcao auxiliar para registrar log de acesso
async function logAccess(
  turnstileId: number,
  userId: string | null,
  direction: string,
  authMethod: string,
  accessToken: string | null,
  status: string,
  denialReason: string | null
) {
  await sql`
    INSERT INTO turnstile_access_logs 
    (user_id, turnstile_id, access_type, auth_method, access_token_used, status, denial_reason)
    VALUES (${userId}, ${turnstileId}, ${direction}, ${authMethod}, ${accessToken}, ${status}, ${denialReason})
  `
}

// GET para verificar status da API (health check das catracas)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const turnstileCode = searchParams.get("turnstile_code")

  if (turnstileCode) {
    const turnstiles = await sql`
      SELECT * FROM turnstiles WHERE turnstile_code = ${turnstileCode}
    `
    
    if (turnstiles.length > 0) {
      await sql`UPDATE turnstiles SET last_ping = NOW() WHERE turnstile_code = ${turnstileCode}`
      return NextResponse.json({ 
        status: "online", 
        turnstile: turnstiles[0].name,
        time: new Date().toISOString()
      })
    }
  }

  return NextResponse.json({ 
    status: "ok", 
    service: "FitTransform Turnstile API",
    version: "1.0.0",
    time: new Date().toISOString()
  })
}
