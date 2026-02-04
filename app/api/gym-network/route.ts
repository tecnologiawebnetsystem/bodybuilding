import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Buscar redes e unidades
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get("ownerId")
    const networkId = searchParams.get("networkId")

    // Buscar rede especifica com unidades
    if (networkId) {
      const network = await sql`
        SELECT * FROM gym_networks WHERE id = ${networkId}
      `
      
      const units = await sql`
        SELECT * FROM gym_units WHERE network_id = ${networkId} ORDER BY name
      `
      
      return NextResponse.json({
        success: true,
        data: {
          network: network[0],
          units
        }
      })
    }

    // Buscar todas as redes do proprietario
    if (ownerId) {
      const networks = await sql`
        SELECT gn.*, 
          (SELECT COUNT(*) FROM gym_units WHERE network_id = gn.id) as units_count,
          (SELECT COUNT(*) FROM user_subscriptions us 
           JOIN gym_units gu ON us.gym_unit_id = gu.id 
           WHERE gu.network_id = gn.id AND us.status = 'active') as active_members
        FROM gym_networks gn
        WHERE gn.owner_id = ${ownerId}
        ORDER BY gn.name
      `
      
      return NextResponse.json({ success: true, data: networks })
    }

    return NextResponse.json({ success: false, error: "Parametros invalidos" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao buscar rede:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar dados" }, { status: 500 })
  }
}

// POST - Criar rede ou unidade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === "create_network") {
      const { name, ownerId, logoUrl } = body
      
      const result = await sql`
        INSERT INTO gym_networks (name, owner_id, logo_url)
        VALUES (${name}, ${ownerId}, ${logoUrl})
        RETURNING *
      `
      
      return NextResponse.json({ success: true, data: result[0] })
    }

    if (action === "create_unit") {
      const { 
        networkId, name, address, city, state, phone, email, 
        maxCapacity, openingHours, amenities 
      } = body
      
      const result = await sql`
        INSERT INTO gym_units (
          network_id, name, address, city, state, phone, email,
          max_capacity, opening_hours, amenities
        ) VALUES (
          ${networkId}, ${name}, ${address}, ${city}, ${state}, ${phone}, ${email},
          ${maxCapacity || 100}, ${openingHours || null}, ${amenities || []}
        )
        RETURNING *
      `
      
      return NextResponse.json({ success: true, data: result[0] })
    }

    return NextResponse.json({ success: false, error: "Acao invalida" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao criar:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar" }, { status: 500 })
  }
}

// PUT - Atualizar rede ou unidade
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id } = body

    if (type === "network") {
      const { name, logoUrl } = body
      
      await sql`
        UPDATE gym_networks 
        SET name = ${name}, logo_url = ${logoUrl}
        WHERE id = ${id}
      `
      
      return NextResponse.json({ success: true })
    }

    if (type === "unit") {
      const { 
        name, address, city, state, phone, email,
        maxCapacity, openingHours, amenities, isActive 
      } = body
      
      await sql`
        UPDATE gym_units 
        SET 
          name = COALESCE(${name}, name),
          address = COALESCE(${address}, address),
          city = COALESCE(${city}, city),
          state = COALESCE(${state}, state),
          phone = COALESCE(${phone}, phone),
          email = COALESCE(${email}, email),
          max_capacity = COALESCE(${maxCapacity}, max_capacity),
          opening_hours = COALESCE(${openingHours}, opening_hours),
          amenities = COALESCE(${amenities}, amenities),
          is_active = COALESCE(${isActive}, is_active)
        WHERE id = ${id}
      `
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Tipo invalido" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao atualizar:", error)
    return NextResponse.json({ success: false, error: "Erro ao atualizar" }, { status: 500 })
  }
}

// DELETE - Desativar unidade
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unitId = searchParams.get("unitId")

    if (unitId) {
      await sql`
        UPDATE gym_units SET is_active = false WHERE id = ${unitId}
      `
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "unitId obrigatorio" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao deletar:", error)
    return NextResponse.json({ success: false, error: "Erro ao deletar" }, { status: 500 })
  }
}
