import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const classes = await sql`
      SELECT * FROM gym_classes 
      WHERE gym_id = 1 
      ORDER BY day_of_week, start_time
    `

    return Response.json({ classes })
  } catch (error) {
    return Response.json({ error: "Erro ao buscar aulas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { class_name, instructor, description, day_of_week, start_time, duration_minutes, max_capacity } = body

    const result = await sql`
      INSERT INTO gym_classes (gym_id, class_name, instructor, description, day_of_week, start_time, duration_minutes, max_capacity, is_active)
      VALUES (1, ${class_name}, ${instructor}, ${description}, ${day_of_week}, ${start_time}, ${duration_minutes}, ${max_capacity}, true)
      RETURNING *
    `

    return Response.json({ class: result[0] })
  } catch (error) {
    return Response.json({ error: "Erro ao criar aula" }, { status: 500 })
  }
}
