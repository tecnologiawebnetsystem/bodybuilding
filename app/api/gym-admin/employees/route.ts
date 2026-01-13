import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Listar todos os funcionários
export async function GET() {
  try {
    const employees = await sql`
      SELECT * FROM gym_employees 
      ORDER BY name ASC
    `
    return Response.json(employees)
  } catch (error) {
    return Response.json({ error: "Erro ao buscar funcionários" }, { status: 500 })
  }
}

// POST - Criar novo funcionário
export async function POST(request: Request) {
  try {
    const { name, cpf, position, phone, email, salary, hire_date } = await request.json()

    const result = await sql`
      INSERT INTO gym_employees (name, cpf, position, phone, email, salary, hire_date, status)
      VALUES (${name}, ${cpf}, ${position}, ${phone}, ${email}, ${salary}, ${hire_date}, 'active')
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao criar funcionário" }, { status: 500 })
  }
}

// PUT - Atualizar funcionário
export async function PUT(request: Request) {
  try {
    const { id, name, cpf, position, phone, email, salary, status } = await request.json()

    const result = await sql`
      UPDATE gym_employees 
      SET name = ${name}, 
          cpf = ${cpf}, 
          position = ${position},
          phone = ${phone},
          email = ${email},
          salary = ${salary},
          status = ${status}
      WHERE id = ${id}
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: "Erro ao atualizar funcionário" }, { status: 500 })
  }
}

// DELETE - Deletar funcionário
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await sql`DELETE FROM gym_employees WHERE id = ${id}`

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Erro ao deletar funcionário" }, { status: 500 })
  }
}
