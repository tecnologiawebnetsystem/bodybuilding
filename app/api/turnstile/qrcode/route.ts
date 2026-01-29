import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import crypto from "crypto"

const sql = neon(process.env.DATABASE_URL!)

/**
 * API para gerar e gerenciar QR Codes de acesso
 */

// GET - Buscar ou gerar QR Code do usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId obrigatorio" }, { status: 400 })
    }

    // Verificar se ja tem token ativo
    let tokens = await sql`
      SELECT * FROM user_access_tokens 
      WHERE user_id = ${userId} 
        AND token_type = 'qrcode'
        AND is_active = true
        AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY created_at DESC
      LIMIT 1
    `

    // Se nao tem token ou expirou, criar novo
    if (tokens.length === 0) {
      const newToken = generateAccessToken(userId)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // Expira em 24h

      await sql`
        INSERT INTO user_access_tokens (user_id, access_token, token_type, expires_at)
        VALUES (${userId}, ${newToken}, 'qrcode', ${expiresAt.toISOString()})
      `

      tokens = await sql`
        SELECT * FROM user_access_tokens 
        WHERE user_id = ${userId} AND access_token = ${newToken}
      `
    }

    const token = tokens[0]

    // Buscar info de pagamento
    const payments = await sql`
      SELECT * FROM student_payments 
      WHERE user_id = ${userId} 
        AND status = 'paid'
        AND due_date >= CURRENT_DATE - INTERVAL '5 days'
      ORDER BY due_date DESC
      LIMIT 1
    `

    const memberships = await sql`
      SELECT * FROM memberships 
      WHERE user_id = ${userId} 
        AND status = 'active'
        AND end_date >= CURRENT_DATE
      LIMIT 1
    `

    const isPaymentValid = payments.length > 0 || memberships.length > 0

    return NextResponse.json({
      success: true,
      access_token: token.access_token,
      expires_at: token.expires_at,
      is_active: token.is_active,
      payment_status: isPaymentValid ? "em_dia" : "pendente",
      qr_data: JSON.stringify({
        t: token.access_token,
        u: userId,
        v: "1"
      })
    })

  } catch (error) {
    console.error("[v0] QR Code error:", error)
    return NextResponse.json({ error: "Erro ao gerar QR Code" }, { status: 500 })
  }
}

// POST - Renovar QR Code (gerar novo token)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "userId obrigatorio" }, { status: 400 })
    }

    // Desativar tokens antigos
    await sql`
      UPDATE user_access_tokens 
      SET is_active = false 
      WHERE user_id = ${userId} AND token_type = 'qrcode'
    `

    // Gerar novo token
    const newToken = generateAccessToken(userId)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    await sql`
      INSERT INTO user_access_tokens (user_id, access_token, token_type, expires_at)
      VALUES (${userId}, ${newToken}, 'qrcode', ${expiresAt.toISOString()})
    `

    return NextResponse.json({
      success: true,
      access_token: newToken,
      expires_at: expiresAt.toISOString(),
      message: "QR Code renovado com sucesso"
    })

  } catch (error) {
    console.error("[v0] QR Code renewal error:", error)
    return NextResponse.json({ error: "Erro ao renovar QR Code" }, { status: 500 })
  }
}

// Funcao para gerar token unico
function generateAccessToken(userId: string): string {
  const timestamp = Date.now().toString(36)
  const random = crypto.randomBytes(8).toString("hex")
  const hash = crypto.createHash("sha256")
    .update(`${userId}-${timestamp}-${random}`)
    .digest("hex")
    .slice(0, 16)
  
  return `FT${timestamp}${hash}`.toUpperCase()
}
