import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Listar todos os pagamentos de alunos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query
    if (status) {
      query = await sql`
        SELECT 
          sp.*,
          u.name as student_name,
          pm.method_name as payment_method
        FROM student_payments sp
        JOIN users u ON sp.user_id = u.user_id
        LEFT JOIN payment_methods pm ON sp.payment_method_id = pm.id
        WHERE sp.status = ${status}
        ORDER BY sp.due_date DESC
      `
    } else {
      query = await sql`
        SELECT 
          sp.*,
          u.name as student_name,
          pm.method_name as payment_method
        FROM student_payments sp
        JOIN users u ON sp.user_id = u.user_id
        LEFT JOIN payment_methods pm ON sp.payment_method_id = pm.id
        ORDER BY sp.due_date DESC
      `
    }

    return Response.json(query)
  } catch (error) {
    return Response.json({ error: "Erro ao buscar pagamentos" }, { status: 500 })
  }
}

// POST - Registrar pagamento
export async function POST(request: Request) {
  try {
    const { enrollment_id, user_id, amount, payment_method_id, payment_date, due_date, status, notes } =
      await request.json()

    const result = await sql`
      INSERT INTO student_payments (enrollment_id, user_id, amount, payment_method_id, payment_date, due_date, status, notes)
      VALUES (${enrollment_id}, ${user_id}, ${amount}, ${payment_method_id}, ${payment_date}, ${due_date}, ${status}, ${notes})
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao registrar pagamento" }, { status: 500 })
  }
}

// PUT - Atualizar pagamento
export async function PUT(request: Request) {
  try {
    const { id, status, payment_method_id, payment_date } = await request.json()

    const result = await sql`
      UPDATE student_payments 
      SET status = ${status}, 
          payment_method_id = ${payment_method_id},
          payment_date = ${payment_date}
      WHERE id = ${id}
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao atualizar pagamento" }, { status: 500 })
  }
}
