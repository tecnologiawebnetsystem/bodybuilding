import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, phone, cpf, pin, businessName, cnpj, cref, specialties, bio } = data

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

    // Criar usuário
    await sql`
      INSERT INTO users (user_id, name, email, pin, cpf, role, age, gender, height, current_weight, target_weight, initial_weight, start_date)
      VALUES (${userId}, ${name}, ${email}, ${pin}, ${cpf}, 'trainer', 30, 'Outro', 170, 70, 70, 70, CURRENT_DATE)
    `

    // Criar perfil do personal trainer
    await sql`
      INSERT INTO personal_trainers_profile (user_id, business_name, cnpj, cref, specialties, bio, phone, email)
      VALUES (
        ${userId}, 
        ${businessName}, 
        ${cnpj}, 
        ${cref}, 
        ${specialties ? specialties.split(",").map((s: string) => s.trim()) : []}, 
        ${bio}, 
        ${phone}, 
        ${email}
      )
    `

    return NextResponse.json({
      success: true,
      userId,
      message: "Personal Trainer cadastrado com sucesso!",
    })
  } catch (error: any) {
    console.error("Erro ao cadastrar personal trainer:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Erro ao cadastrar personal trainer",
      },
      { status: 500 },
    )
  }
}
