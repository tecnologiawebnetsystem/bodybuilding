import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { gym_name, email, phone, address, city, state, zip_code, cnpj } = body

    await sql`
      UPDATE gyms 
      SET 
        gym_name = ${gym_name},
        email = ${email},
        phone = ${phone},
        address = ${address},
        city = ${city},
        state = ${state},
        zip_code = ${zip_code},
        cnpj = ${cnpj}
      WHERE id = 1
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar dados da academia:", error)
    return NextResponse.json({ error: "Erro ao atualizar dados" }, { status: 500 })
  }
}
