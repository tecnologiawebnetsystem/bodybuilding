import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Listar todos os planos
export async function GET() {
  try {
    const plans = await sql`
      SELECT * FROM gym_membership_plans 
      ORDER BY duration_months ASC
    `
    return Response.json(plans)
  } catch (error) {
    return Response.json({ error: "Erro ao buscar planos" }, { status: 500 })
  }
}

// POST - Criar novo plano
export async function POST(request: Request) {
  try {
    const { plan_name, duration_months, price, description } = await request.json()

    const result = await sql`
      INSERT INTO gym_membership_plans (plan_name, duration_months, price, description)
      VALUES (${plan_name}, ${duration_months}, ${price}, ${description})
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao criar plano" }, { status: 500 })
  }
}

// PUT - Atualizar plano
export async function PUT(request: Request) {
  try {
    const { id, plan_name, duration_months, price, description, is_active } = await request.json()

    const result = await sql`
      UPDATE gym_membership_plans 
      SET plan_name = ${plan_name}, 
          duration_months = ${duration_months}, 
          price = ${price}, 
          description = ${description},
          is_active = ${is_active}
      WHERE id = ${id}
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao atualizar plano" }, { status: 500 })
  }
}

// DELETE - Deletar plano
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await sql`DELETE FROM gym_membership_plans WHERE id = ${id}`

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Erro ao deletar plano" }, { status: 500 })
  }
}
