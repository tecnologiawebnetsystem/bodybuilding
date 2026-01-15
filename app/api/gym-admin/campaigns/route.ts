import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const campaigns = await sql`
      SELECT * FROM marketing_campaigns 
      WHERE gym_id = 1 
      ORDER BY created_at DESC
    `

    return Response.json({ campaigns })
  } catch (error) {
    return Response.json({ error: "Erro ao buscar campanhas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { campaign_name, campaign_type, target_audience, message_template, scheduled_date } = body

    const result = await sql`
      INSERT INTO marketing_campaigns (gym_id, campaign_name, campaign_type, target_audience, message_template, scheduled_date, status)
      VALUES (1, ${campaign_name}, ${campaign_type}, ${target_audience}, ${message_template}, ${scheduled_date || null}, 'draft')
      RETURNING *
    `

    return Response.json({ campaign: result[0] })
  } catch (error) {
    return Response.json({ error: "Erro ao criar campanha" }, { status: 500 })
  }
}
