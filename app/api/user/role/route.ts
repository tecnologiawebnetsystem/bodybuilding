import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "userId é obrigatório" }, { status: 400 })
    }

    const result = await sql`
      SELECT user_role 
      FROM users 
      WHERE user_id = ${userId}
    `

    if (result.length === 0) {
      return Response.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return Response.json({ role: result[0].user_role || "student" })
  } catch (error) {
    console.error("Erro ao buscar role do usuário:", error)
    return Response.json({ error: "Erro ao buscar role" }, { status: 500 })
  }
}
