import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 1. Criar a academia no banco
    const gymResult = await sql`
      INSERT INTO gyms (gym_name, cnpj, phone, email, address, city, state, zip_code, is_active)
      VALUES (${data.gymName}, ${data.cnpj}, ${data.phone}, ${data.email}, ${data.address}, ${data.city}, ${data.state}, ${data.zipCode}, true)
      RETURNING id
    `

    const gymId = gymResult[0].id

    // 2. Gerar user_id e PIN para o admin
    const userId = data.email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
    const pin = Math.floor(100000 + Math.random() * 900000).toString() // PIN de 6 dígitos

    // 3. Criar usuário admin da academia
    await sql`
      INSERT INTO users (
        user_id, name, email, pin, role, gym_id, 
        age, gender, height, current_weight, target_weight, initial_weight, start_date
      )
      VALUES (
        ${userId}, ${data.ownerName}, ${data.email}, ${pin}, 'gym_admin', ${gymId},
        30, 'Masculino', 175, 75, 75, 75, CURRENT_DATE
      )
    `

    // 4. Criar planos padrão para a academia
    await sql`
      INSERT INTO gym_membership_plans (gym_id, plan_name, duration_months, price, description, is_active)
      VALUES 
        (${gymId}, 'Mensal', 1, 150.00, 'Plano mensal renovável', true),
        (${gymId}, 'Trimestral', 3, 400.00, 'Plano de 3 meses com desconto', true),
        (${gymId}, 'Semestral', 6, 750.00, 'Plano de 6 meses com desconto', true),
        (${gymId}, 'Anual', 12, 1400.00, 'Plano anual com melhor custo-benefício', true)
    `

    return NextResponse.json({
      success: true,
      gymId,
      userId,
      pin,
      message: "Academia criada com sucesso!",
    })
  } catch (error: any) {
    console.error("Erro ao criar academia:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar cadastro" }, { status: 500 })
  }
}
