import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, cpf, password, gender, age, height, currentWeight, goalWeight, gymCode } = body

    // Validar campos obrigatórios
    if (!name || !email || !cpf || !password || !gender || !age || !height || !currentWeight || !goalWeight) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios" }, { status: 400 })
    }

    // Verificar se CPF já existe
    const existingUser = await sql`
      SELECT user_id FROM users WHERE cpf = ${cpf}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "CPF já cadastrado" }, { status: 400 })
    }

    // Gerar user_id único baseado no nome
    const userId = name.toLowerCase().replace(/\s+/g, "_") + "_" + Math.random().toString(36).substring(2, 7)

    // Buscar gym_id pelo código (se fornecido), senão usa academia padrão (1)
    let gymId = 1 // Academia padrão FitTransform
    if (gymCode) {
      const gym = await sql`SELECT id FROM gyms WHERE id = ${Number.parseInt(gymCode)}`
      if (gym.length > 0) {
        gymId = gym[0].id
      }
    }

    // Criar novo aluno
    await sql`
      INSERT INTO users (
        user_id, name, email, cpf, password, role, gender, age, height, 
        current_weight, target_weight, initial_weight, start_date, gym_id
      ) VALUES (
        ${userId}, ${name}, ${email}, ${cpf}, ${password}, 'student', ${gender}, 
        ${Number.parseInt(age)}, ${Number.parseInt(height)}, ${Number.parseFloat(currentWeight)}, 
        ${Number.parseFloat(goalWeight)}, ${Number.parseFloat(currentWeight)}, CURRENT_DATE, ${gymId}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Cadastro realizado com sucesso!",
    })
  } catch (error: any) {
    console.error("[v0] Erro ao cadastrar aluno:", error)
    return NextResponse.json({ error: "Erro ao cadastrar. Tente novamente." }, { status: 500 })
  }
}
