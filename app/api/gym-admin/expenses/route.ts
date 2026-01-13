import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Listar todas as despesas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query
    if (category) {
      query = await sql`
        SELECT 
          e.*,
          pm.method_name as payment_method
        FROM gym_expenses e
        LEFT JOIN payment_methods pm ON e.payment_method_id = pm.id
        WHERE e.category = ${category}
        ORDER BY e.expense_date DESC
      `
    } else {
      query = await sql`
        SELECT 
          e.*,
          pm.method_name as payment_method
        FROM gym_expenses e
        LEFT JOIN payment_methods pm ON e.payment_method_id = pm.id
        ORDER BY e.expense_date DESC
      `
    }

    return Response.json(query)
  } catch (error) {
    return Response.json({ error: "Erro ao buscar despesas" }, { status: 500 })
  }
}

// POST - Registrar despesa
export async function POST(request: Request) {
  try {
    const { description, category, amount, expense_date, payment_method_id, notes } = await request.json()

    const result = await sql`
      INSERT INTO gym_expenses (description, category, amount, expense_date, payment_method_id, notes)
      VALUES (${description}, ${category}, ${amount}, ${expense_date}, ${payment_method_id}, ${notes})
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao registrar despesa" }, { status: 500 })
  }
}

// PUT - Atualizar despesa
export async function PUT(request: Request) {
  try {
    const { id, description, category, amount, expense_date, payment_method_id, notes } = await request.json()

    const result = await sql`
      UPDATE gym_expenses 
      SET description = ${description}, 
          category = ${category},
          amount = ${amount},
          expense_date = ${expense_date},
          payment_method_id = ${payment_method_id},
          notes = ${notes}
      WHERE id = ${id}
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao atualizar despesa" }, { status: 500 })
  }
}

// DELETE - Deletar despesa
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await sql`DELETE FROM gym_expenses WHERE id = ${id}`

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Erro ao deletar despesa" }, { status: 500 })
  }
}
