import { type NextRequest, NextResponse } from "next/server"
import { clearRunningHistory } from "@/lib/db"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID obrigatório" }, { status: 400 })
    }

    const deleted = await clearRunningHistory(userId)
    return NextResponse.json({ success: true, data: { count: deleted.length } })
  } catch (error) {
    console.error("[v0] Error clearing running history:", error)
    return NextResponse.json({ success: false, error: "Erro ao limpar histórico de corridas" }, { status: 500 })
  }
}
