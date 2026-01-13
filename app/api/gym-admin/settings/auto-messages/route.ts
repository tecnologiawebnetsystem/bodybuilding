import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Salvar configurações de mensagens automáticas
    // Por enquanto, apenas retornar sucesso
    // Em produção, você salvaria em uma tabela de configurações

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar mensagens automáticas:", error)
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 })
  }
}
