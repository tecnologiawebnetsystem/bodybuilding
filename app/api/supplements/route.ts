import { type NextRequest, NextResponse } from "next/server"
import { getSupplementLogs, toggleSupplementLog, addSupplementLog } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const date = searchParams.get("date")

    if (!userId || !date) {
      return NextResponse.json({ error: "User ID e data obrigatórios" }, { status: 400 })
    }

    const logs = await getSupplementLogs(userId, date)
    return NextResponse.json({ logs })
  } catch (error) {
    console.error("[v0] Error fetching supplement logs:", error)
    return NextResponse.json({ error: "Erro ao buscar logs de suplementos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, supplementName, dosage, time, date } = await request.json()

    if (!userId || !supplementName || !dosage || !time || !date) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const log = await addSupplementLog(userId, supplementName, dosage, time, date)
    return NextResponse.json({ log, success: true })
  } catch (error) {
    console.error("[v0] Error adding supplement log:", error)
    return NextResponse.json({ error: "Erro ao adicionar log de suplemento" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, taken } = await request.json()

    if (id === undefined || taken === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const log = await toggleSupplementLog(id, taken)
    return NextResponse.json({ log, success: true })
  } catch (error) {
    console.error("[v0] Error toggling supplement log:", error)
    return NextResponse.json({ error: "Erro ao atualizar log de suplemento" }, { status: 500 })
  }
}
