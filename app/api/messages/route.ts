import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Buscar notificacoes/mensagens do usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId obrigatorio" }, { status: 400 })
    }

    let notifications
    if (unreadOnly) {
      notifications = await sql`
        SELECT * FROM notifications 
        WHERE user_id = ${userId} AND is_read = false
        ORDER BY sent_at DESC
        LIMIT 50
      `
    } else {
      notifications = await sql`
        SELECT * FROM notifications 
        WHERE user_id = ${userId}
        ORDER BY sent_at DESC
        LIMIT 100
      `
    }

    // Contar nao lidas
    const unreadCount = await sql`
      SELECT COUNT(*) as count FROM notifications 
      WHERE user_id = ${userId} AND is_read = false
    `

    return NextResponse.json({ 
      success: true, 
      data: notifications,
      unreadCount: parseInt(unreadCount[0]?.count || "0")
    })
  } catch (error) {
    console.error("Erro ao buscar notificacoes:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar notificacoes" }, { status: 500 })
  }
}

// POST - Criar notificacao
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, actionUrl } = body

    if (!userId || !title) {
      return NextResponse.json({ success: false, error: "userId e title obrigatorios" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO notifications (user_id, type, title, message, action_url)
      VALUES (${userId}, ${type || 'system'}, ${title}, ${message}, ${actionUrl})
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Erro ao criar notificacao:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar notificacao" }, { status: 500 })
  }
}

// PUT - Marcar notificacao como lida
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, userId, markAllRead } = body

    if (markAllRead && userId) {
      await sql`
        UPDATE notifications 
        SET is_read = true, read_at = NOW()
        WHERE user_id = ${userId} AND is_read = false
      `
      return NextResponse.json({ success: true, message: "Todas as notificacoes marcadas como lidas" })
    }

    if (notificationId) {
      await sql`
        UPDATE notifications 
        SET is_read = true, read_at = NOW()
        WHERE id = ${notificationId}
      `
      return NextResponse.json({ success: true, message: "Notificacao marcada como lida" })
    }

    return NextResponse.json({ success: false, error: "Parametros invalidos" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao atualizar notificacao:", error)
    return NextResponse.json({ success: false, error: "Erro ao atualizar" }, { status: 500 })
  }
}
