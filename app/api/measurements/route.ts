import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  }

  try {
    const measurements = await sql`
      SELECT * FROM body_measurements
      WHERE user_id = ${userId}
      ORDER BY measurement_date DESC
      LIMIT 50
    `

    return NextResponse.json({ success: true, data: measurements })
  } catch (error) {
    console.error("[v0] Error fetching measurements:", error)
    return NextResponse.json({ error: "Erro ao buscar medidas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      measurementDate,
      weight,
      neck, // Adicionado campo pescoço para cálculo de BF%
      chest,
      waist,
      hips,
      armLeft,
      armRight,
      thighLeft,
      thighRight,
      bodyFatPercentage,
      notes,
    } = body

    if (!userId || !measurementDate) {
      return NextResponse.json({ error: "userId e measurementDate são obrigatórios" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO body_measurements (
        user_id, measurement_date, weight, neck, chest, waist, hips,
        arm_left, arm_right, thigh_left, thigh_right, body_fat_percentage, notes
      )
      VALUES (
        ${userId}, ${measurementDate}, ${weight}, ${neck}, ${chest}, ${waist}, ${hips},
        ${armLeft}, ${armRight}, ${thighLeft}, ${thighRight}, ${bodyFatPercentage}, ${notes}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error saving measurement:", error)
    return NextResponse.json({ error: "Erro ao salvar medida" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })
  }

  try {
    await sql`DELETE FROM body_measurements WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting measurement:", error)
    return NextResponse.json({ error: "Erro ao excluir medida" }, { status: 500 })
  }
}
