import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const leads = await sql`
      SELECT * FROM gym_leads 
      WHERE gym_id = 1 
      ORDER BY created_at DESC
    `

    return Response.json({ leads })
  } catch (error) {
    return Response.json({ error: "Erro ao buscar leads" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, source, notes, follow_up_date } = body

    const result = await sql`
      INSERT INTO gym_leads (gym_id, name, email, phone, source, notes, follow_up_date, status)
      VALUES (1, ${name}, ${email}, ${phone}, ${source}, ${notes}, ${follow_up_date}, 'new')
      RETURNING *
    `

    return Response.json({ lead: result[0] })
  } catch (error) {
    return Response.json({ error: "Erro ao criar lead" }, { status: 500 })
  }
}
