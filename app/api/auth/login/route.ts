import { type NextRequest, NextResponse } from "next/server"
import { verifyPin } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    // Map PINs to user IDs
    const pinMap: Record<string, string> = {
      "080754": "kleber",
      "191018": "pamela",
    }

    const userId = pinMap[pin]

    if (!userId) {
      return NextResponse.json({ error: "PIN inválido" }, { status: 401 })
    }

    // Verify PIN in database
    const isValid = await verifyPin(userId, pin)

    if (!isValid) {
      return NextResponse.json({ error: "PIN inválido" }, { status: 401 })
    }

    return NextResponse.json({ userId, success: true })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
