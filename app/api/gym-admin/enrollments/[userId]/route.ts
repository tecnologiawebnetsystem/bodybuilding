import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// PUT - Atualizar status da matrícula de um aluno específico
export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { status } = await request.json()
    const { userId } = params

    const result = await sql`
      UPDATE student_enrollments 
      SET status = ${status}
      WHERE user_id = ${userId}
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    console.error("[v0] Erro ao atualizar matrícula:", error)
    return Response.json({ error: "Erro ao atualizar matrícula" }, { status: 500 })
  }
}

// DELETE - Excluir aluno e todas suas matrículas
export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    // Excluir matrículas primeiro
    await sql`DELETE FROM student_enrollments WHERE user_id = ${userId}`

    // Excluir o usuário
    await sql`DELETE FROM users WHERE user_id = ${userId}`

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao excluir aluno:", error)
    return Response.json({ error: "Erro ao excluir aluno" }, { status: 500 })
  }
}
