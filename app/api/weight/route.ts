import { type NextRequest, NextResponse } from "next/server"
import { getWeightLogs, addWeightLog } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID obrigatório" }, { status: 400 })
    }

    const logs = await getWeightLogs(userId)
    return NextResponse.json({ logs })
  } catch (error) {
    console.error("[v0] Error fetching weight logs:", error)
    return NextResponse.json({ error: "Erro ao buscar logs de peso" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, weight, date, notes } = await request.json()

    if (!userId || !weight || !date) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const log = await addWeightLog(userId, weight, date, notes)
    return NextResponse.json({ log, success: true })
  } catch (error) {
    console.error("[v0] Error adding weight log:", error)
    return NextResponse.json({ error: "Erro ao adicionar log de peso" }, { status: 500 })
  }
}
