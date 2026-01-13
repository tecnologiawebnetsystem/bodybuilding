import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Listar todos os alunos da FitTransform
export async function GET() {
  try {
    const students = await sql`
      SELECT 
        u.user_id,
        u.name as student_name,
        u.email,
        u.gender,
        u.height,
        u.current_weight,
        u.target_weight,
        u.gym_id,
        u.created_at,
        COALESCE(e.status, 'active') as status,
        p.plan_name,
        e.start_date,
        e.end_date,
        e.monthly_value
      FROM users u
      LEFT JOIN student_enrollments e ON u.user_id = e.user_id AND e.status = 'active'
      LEFT JOIN gym_membership_plans p ON e.plan_id = p.id
      WHERE u.gym_id = 1
      ORDER BY u.created_at DESC
    `
    return Response.json(students)
  } catch (error) {
    console.error("[v0] Erro ao buscar alunos:", error)
    return Response.json({ error: "Erro ao buscar alunos" }, { status: 500 })
  }
}

// POST - Criar nova matrícula
export async function POST(request: Request) {
  try {
    const { user_id, plan_id, start_date, monthly_value } = await request.json()

    // Buscar duração do plano
    const plan = await sql`SELECT duration_months FROM gym_membership_plans WHERE id = ${plan_id}`
    const duration_months = plan[0].duration_months

    // Calcular data de término
    const startDate = new Date(start_date)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + duration_months)

    const result = await sql`
      INSERT INTO student_enrollments (user_id, plan_id, start_date, end_date, monthly_value, status)
      VALUES (${user_id}, ${plan_id}, ${start_date}, ${endDate.toISOString().split("T")[0]}, ${monthly_value}, 'active')
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    console.error("[v0] Erro ao criar matrícula:", error)
    return Response.json({ error: "Erro ao criar matrícula" }, { status: 500 })
  }
}

// PUT - Atualizar status da matrícula
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()

    const result = await sql`
      UPDATE student_enrollments 
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao atualizar matrícula" }, { status: 500 })
  }
}
