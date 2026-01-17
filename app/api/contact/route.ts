import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()

    // Em produção, você integraria com um serviço de email como SendGrid, Resend, etc.
    console.log("[v0] Mensagem de contato recebida:", { name, email, phone, message })

    // Simulação de envio bem-sucedido
    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso" })
  } catch (error) {
    console.error("Erro ao processar contato:", error)
    return NextResponse.json({ error: "Erro ao processar mensagem" }, { status: 500 })
  }
}
