import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, cpf, phone, age, gender, pin } = data

    // Gerar user_id único baseado no nome
    const userId =
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 20) +
      "_" +
      Math.random().toString(36).substring(2, 6)

    // Criar usuário aluno independente (sem gym_id)
    await sql`
      INSERT INTO users (
        user_id, name, email, pin, cpf, role, age, gender, 
        height, current_weight, target_weight, initial_weight, start_date
      )
      VALUES (
        ${userId}, ${name}, ${email}, ${pin}, ${cpf}, 'student', 
        ${age ? Number.parseInt(age) : null}, ${gender}, 
        170, 70, 70, 70, CURRENT_DATE
      )
    `

    return NextResponse.json({
      success: true,
      userId,
      message: "Aluno cadastrado com sucesso! Faça login para começar a treinar.",
    })
  } catch (error: any) {
    console.error("Erro ao cadastrar aluno:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Erro ao cadastrar aluno",
      },
      { status: 500 },
    )
  }
}
