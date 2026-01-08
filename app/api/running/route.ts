import { type NextRequest, NextResponse } from "next/server"
import { getRunningCheckins, addRunningCheckin, deleteRunningCheckin } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID obrigatório" }, { status: 400 })
    }

    const checkins = await getRunningCheckins(userId)
    return NextResponse.json({ success: true, data: checkins })
  } catch (error) {
    console.error("[v0] Error fetching running checkins:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar check-ins de corrida" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, distance, duration } = await request.json()

    if (!userId || !distance || !duration) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 })
    }

    const today = new Date().toISOString().split("T")[0]
    const checkin = await addRunningCheckin(userId, distance, duration, today)

    return NextResponse.json({ success: true, data: checkin })
  } catch (error) {
    console.error("[v0] Error adding running checkin:", error)
    return NextResponse.json({ success: false, error: "Erro ao adicionar check-in de corrida" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID obrigatório" }, { status: 400 })
    }

    const deleted = await deleteRunningCheckin(Number.parseInt(id))
    return NextResponse.json({ success: true, data: deleted })
  } catch (error) {
    console.error("[v0] Error deleting running checkin:", error)
    return NextResponse.json({ success: false, error: "Erro ao deletar check-in de corrida" }, { status: 500 })
  }
}
