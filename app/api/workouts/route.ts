import { type NextRequest, NextResponse } from "next/server"
import { getWorkoutCheckins, addWorkoutCheckin } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const date = searchParams.get("date")

    if (!userId || !date) {
      return NextResponse.json({ error: "User ID e data obrigatórios" }, { status: 400 })
    }

    const checkins = await getWorkoutCheckins(userId, date)
    return NextResponse.json({ checkins })
  } catch (error) {
    console.error("[v0] Error fetching workout checkins:", error)
    return NextResponse.json({ error: "Erro ao buscar check-ins de treino" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, workoutType, workoutName, date, notes } = await request.json()

    if (!userId || !workoutType || !workoutName || !date) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const checkin = await addWorkoutCheckin(userId, workoutType, workoutName, date, notes)
    return NextResponse.json({ checkin, success: true })
  } catch (error) {
    console.error("[v0] Error adding workout checkin:", error)
    return NextResponse.json({ error: "Erro ao adicionar check-in de treino" }, { status: 500 })
  }
}
