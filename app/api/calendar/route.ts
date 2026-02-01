import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Buscar eventos do calendario
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  if (!userId) {
    return NextResponse.json({ success: false, error: "userId obrigatorio" }, { status: 400 })
  }

  try {
    // Buscar eventos do usuario no periodo
    const events = await sql`
      SELECT * FROM calendar_events 
      WHERE user_id = ${userId}
      AND (
        (recurrence_type = 'none' AND start_date >= ${startDate || '2020-01-01'}::date AND start_date <= ${endDate || '2030-12-31'}::date)
        OR recurrence_type != 'none'
      )
      ORDER BY start_date, start_time
    `

    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error("Erro ao buscar eventos:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar eventos" }, { status: 500 })
  }
}

// POST - Criar novo evento
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      userId,
      title,
      description,
      eventType,
      startDate,
      startTime,
      endTime,
      recurrenceType,
      recurrenceEndDate,
      recurrenceDays,
      color,
      notifyBefore,
      location,
      gymClassId
    } = body

    if (!userId || !title || !startDate) {
      return NextResponse.json({ success: false, error: "Campos obrigatorios faltando" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO calendar_events (
        user_id, title, description, event_type, start_date, start_time, end_time,
        recurrence_type, recurrence_end_date, recurrence_days, color, notify_before,
        location, gym_class_id
      ) VALUES (
        ${userId}, ${title}, ${description || null}, ${eventType || 'personal'},
        ${startDate}, ${startTime || null}, ${endTime || null},
        ${recurrenceType || 'none'}, ${recurrenceEndDate || null}, 
        ${recurrenceDays ? JSON.stringify(recurrenceDays) : null},
        ${color || '#3b82f6'}, ${notifyBefore || 30}, ${location || null}, ${gymClassId || null}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Erro ao criar evento:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar evento" }, { status: 500 })
  }
}

// PUT - Atualizar evento
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      title,
      description,
      eventType,
      startDate,
      startTime,
      endTime,
      recurrenceType,
      recurrenceEndDate,
      recurrenceDays,
      color,
      notifyBefore,
      location
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "ID obrigatorio" }, { status: 400 })
    }

    const result = await sql`
      UPDATE calendar_events SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        event_type = COALESCE(${eventType}, event_type),
        start_date = COALESCE(${startDate}, start_date),
        start_time = COALESCE(${startTime}, start_time),
        end_time = COALESCE(${endTime}, end_time),
        recurrence_type = COALESCE(${recurrenceType}, recurrence_type),
        recurrence_end_date = ${recurrenceEndDate},
        recurrence_days = ${recurrenceDays ? JSON.stringify(recurrenceDays) : null},
        color = COALESCE(${color}, color),
        notify_before = COALESCE(${notifyBefore}, notify_before),
        location = ${location},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Erro ao atualizar evento:", error)
    return NextResponse.json({ success: false, error: "Erro ao atualizar evento" }, { status: 500 })
  }
}

// DELETE - Remover evento
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ success: false, error: "ID obrigatorio" }, { status: 400 })
  }

  try {
    await sql`DELETE FROM calendar_events WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar evento:", error)
    return NextResponse.json({ success: false, error: "Erro ao deletar evento" }, { status: 500 })
  }
}
