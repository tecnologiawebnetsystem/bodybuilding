import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Listar todas as formas de pagamento
export async function GET() {
  try {
    const methods = await sql`
      SELECT * FROM payment_methods 
      ORDER BY method_name ASC
    `
    return Response.json(methods)
  } catch (error) {
    return Response.json({ error: "Erro ao buscar formas de pagamento" }, { status: 500 })
  }
}

// POST - Criar nova forma de pagamento
export async function POST(request: Request) {
  try {
    const { method_name, description } = await request.json()

    const result = await sql`
      INSERT INTO payment_methods (method_name, description)
      VALUES (${method_name}, ${description})
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao criar forma de pagamento" }, { status: 500 })
  }
}

// PUT - Atualizar forma de pagamento
export async function PUT(request: Request) {
  try {
    const { id, method_name, description, is_active } = await request.json()

    const result = await sql`
      UPDATE payment_methods 
      SET method_name = ${method_name}, 
          description = ${description},
          is_active = ${is_active}
      WHERE id = ${id}
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao atualizar forma de pagamento" }, { status: 500 })
  }
}

// DELETE - Deletar forma de pagamento
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await sql`DELETE FROM payment_methods WHERE id = ${id}`

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Erro ao deletar forma de pagamento" }, { status: 500 })
  }
}
