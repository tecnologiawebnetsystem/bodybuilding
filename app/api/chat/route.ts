import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Buscar conversas e mensagens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const conversationId = searchParams.get("conversationId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId obrigatorio" }, { status: 400 })
    }

    // Se tem conversationId, buscar mensagens da conversa
    if (conversationId) {
      const messages = await sql`
        SELECT cm.*, 
          CASE WHEN cm.sender_type = 'user' THEN up.full_name ELSE 'Personal' END as sender_name
        FROM chat_messages cm
        LEFT JOIN user_profiles up ON cm.sender_id = up.user_id
        WHERE cm.conversation_id = ${conversationId}
        ORDER BY cm.sent_at ASC
      `

      // Marcar mensagens como lidas
      await sql`
        UPDATE chat_messages 
        SET is_read = true 
        WHERE conversation_id = ${conversationId} AND sender_id != ${userId}
      `

      return NextResponse.json({ success: true, data: messages })
    }

    // Buscar todas as conversas do usuario
    const conversations = await sql`
      SELECT cc.*,
        (SELECT COUNT(*) FROM chat_messages cm WHERE cm.conversation_id = cc.id AND cm.is_read = false AND cm.sender_id != ${userId}) as unread_count,
        (SELECT message FROM chat_messages cm WHERE cm.conversation_id = cc.id ORDER BY cm.sent_at DESC LIMIT 1) as last_message,
        (SELECT sent_at FROM chat_messages cm WHERE cm.conversation_id = cc.id ORDER BY cm.sent_at DESC LIMIT 1) as last_message_time
      FROM chat_conversations cc
      WHERE cc.user_id = ${userId} OR cc.trainer_id = ${userId}
      ORDER BY (SELECT sent_at FROM chat_messages cm WHERE cm.conversation_id = cc.id ORDER BY cm.sent_at DESC LIMIT 1) DESC NULLS LAST
    `

    return NextResponse.json({ success: true, data: conversations })
  } catch (error) {
    console.error("Erro ao buscar chat:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar chat" }, { status: 500 })
  }
}

// POST - Criar conversa ou enviar mensagem
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, trainerId, conversationId, message, senderType } = body

    if (action === "create_conversation") {
      // Verificar se ja existe conversa
      const existing = await sql`
        SELECT id FROM chat_conversations 
        WHERE user_id = ${userId} AND trainer_id = ${trainerId} AND status = 'open'
      `

      if (existing.length > 0) {
        return NextResponse.json({ success: true, data: existing[0] })
      }

      const result = await sql`
        INSERT INTO chat_conversations (user_id, trainer_id)
        VALUES (${userId}, ${trainerId})
        RETURNING *
      `

      return NextResponse.json({ success: true, data: result[0] })
    }

    if (action === "send_message") {
      if (!conversationId || !message) {
        return NextResponse.json({ success: false, error: "conversationId e message obrigatorios" }, { status: 400 })
      }

      const result = await sql`
        INSERT INTO chat_messages (conversation_id, sender_id, sender_type, message)
        VALUES (${conversationId}, ${userId}, ${senderType || 'user'}, ${message})
        RETURNING *
      `

      // Atualizar timestamp da conversa
      await sql`
        UPDATE chat_conversations SET updated_at = NOW() WHERE id = ${conversationId}
      `

      return NextResponse.json({ success: true, data: result[0] })
    }

    return NextResponse.json({ success: false, error: "Acao invalida" }, { status: 400 })
  } catch (error) {
    console.error("Erro no chat:", error)
    return NextResponse.json({ success: false, error: "Erro ao processar" }, { status: 500 })
  }
}
