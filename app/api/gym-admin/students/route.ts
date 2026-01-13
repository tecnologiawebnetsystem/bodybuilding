import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// POST - Criar novo aluno com matrícula
export async function POST(request: Request) {
  try {
    const { name, email, gender, height, current_weight, target_weight, plan_id, gym_id } = await request.json()

    // Gerar user_id único baseado no nome
    const user_id = name.toLowerCase().replace(/\s+/g, "") + Math.random().toString(36).substring(7)

    // Criar usuário
    await sql`
      INSERT INTO users (user_id, name, email, gender, height, current_weight, target_weight, initial_weight, gym_id, role, start_date, pin, age)
      VALUES (${user_id}, ${name}, ${email}, ${gender}, ${height}, ${current_weight}, ${target_weight}, ${current_weight}, ${gym_id}, 'student', CURRENT_DATE, '000000', 25)
    `

    // Buscar plano para calcular datas
    const plan = await sql`SELECT duration_months, price FROM gym_membership_plans WHERE id = ${plan_id}`

    if (plan.length > 0) {
      const duration_months = plan[0].duration_months
      const monthly_value = plan[0].price

      const startDate = new Date()
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + duration_months)

      // Criar matrícula
      await sql`
        INSERT INTO student_enrollments (user_id, plan_id, start_date, end_date, monthly_value, status, gym_id)
        VALUES (${user_id}, ${plan_id}, ${startDate.toISOString().split("T")[0]}, ${endDate.toISOString().split("T")[0]}, ${monthly_value}, 'active', ${gym_id})
      `
    }

    return Response.json({ success: true, user_id })
  } catch (error) {
    console.error("[v0] Erro ao criar aluno:", error)
    return Response.json({ error: "Erro ao criar aluno" }, { status: 500 })
  }
}
